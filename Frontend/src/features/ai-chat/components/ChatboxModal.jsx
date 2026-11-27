/* eslint-disable react-hooks/exhaustive-deps */
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import RightArrowIcon from "../../../assets/svg/arrow-right.svg?react";
import BlueCircularImage from "../../../assets/svg/circular-blue-logo.svg?react";
import CloseIcon from "../../../assets/svg/circular-close.svg?react";
import AIProfileIcon from "../../../assets/svg/circular-white-logo.svg?react";
import DownloadIcon from "../../../assets/svg/download.svg?react";
import DoubleTick from "../../../assets/svg/two-tick.svg?react";
import CommonTextarea from "../../../components/CommonTextarea";
import { cn } from "../../../lib/utils";
import { createChat, resetApiState } from "../../../slices/chatbotSlice";
import { formatTimeToAMPM } from "../../../utils/dateAndTime";
import { downloadCSV } from "../../../utils/downloadCSV";
import { apiResponseType } from "../../../utils/types";
import { chatQuerySchema } from "../validations";
import ChatLoading from "./ChatLoading";
// import SaveButton from "../../../components/Buttons/SaveButton";

const quickReplies = [
  "Show my consultation history.",
  "Get the details of my latest visit.",
  "Display my payment receipts.",
  "Show my upcoming appointments.",
  "Get my latest vitals report.",
];

export const keysToRemoveDefault = [
  "_id",
  "createdAt",
  "updatedAt",
  "__v",
  "id",
  "hospitalId",
  "patientId",
  "doctorId",
  "departmentId",
  "appointmentId",
  "userId",
  "dob",
];

// Initial assistant message
const initialMessage = {
  id: "msg_001",
  sender: "assistant",
  timestamp: new Date().toString(),
  type: "text",
  content:
    "I'm here to help you resolve any queries you have with your hospitals/clinic data. Please select from the following options.",
  quickReplies,
};

const ChatboxModal = ({
  open = true,
  onClose: onOpenChange,
  trigger,
  showClose = true,
}) => {
  const form = useForm({
    defaultValues: {
      user_query: "",
    },
    resolver: zodResolver(chatQuerySchema),
  });
  const dispatch = useDispatch();
  const { register, formState, handleSubmit, reset, setValue, getValues } =
    form;
  const { errors } = formState;
  const { chatApi } = useSelector((state) => state.chatbot);
  const { isLoading, status, data, error } = chatApi;

  const [messages, setMessages] = useState([initialMessage]);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Function to scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Also scroll to bottom when loading state changes
  useEffect(() => {
    if (isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  const handleDownload = () => {
    const jsonData = data?.data?.respond?.human_response;
    if (jsonData) {
      // const fixedJson = jsonData.replace(/'/g, '"');
      console.log(jsonData);
      downloadCSV({
        data: jsonData,
        fileName: `${data?.data?.respond?.session_id}.csv`,
        keysToRemove: keysToRemoveDefault,
      });
    }
  };

  const onSubmit = (data) => {
    if (data.user_query.trim() === "") return;
    // Add user message to chat
    const userMessage = {
      id: `msg_${Date.now()}`,
      sender: "user",
      timestamp: new Date().toString(),
      type: "text",
      content: data.user_query,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Add loading message
    const loadingMessage = {
      id: `msg_${Date.now()}_loading`,
      sender: "assistant",
      timestamp: new Date().toString(),
      type: "loading",
    };

    setMessages((prev) => [...prev, loadingMessage]);

    // Send request to API
    dispatch(
      createChat({
        ...data,
        ...(sessionId && { session_id: sessionId }),
      })
    );

    reset();
  };

  const handleQuickReply = (content) => {
    // Simulate user sending the quick reply
    const userMessage = {
      id: `msg_${Date.now()}`,
      sender: "user",
      timestamp: new Date().toString(),
      type: "quick_reply",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Add loading message
    const loadingMessage = {
      id: `msg_${Date.now()}_loading`,
      sender: "assistant",
      timestamp: new Date().toString(),
      type: "loading",
    };

    setMessages((prev) => [...prev, loadingMessage]);

    // Send request to API
    dispatch(
      createChat({
        user_query: content,
        ...(sessionId && { session_id: sessionId }),
      })
    );
  };

  useEffect(() => {
    if (status === apiResponseType.success && data) {
      // Remove loading message
      setMessages((prev) => prev.filter((msg) => msg.type !== "loading"));

      // Store session ID if provided
      if (data.data?.respond?.session_id) {
        setSessionId(data.data.respond.session_id);
      }

      // Add assistant response

      const assistantMessage = {
        id: `msg_${Date.now()}`,
        sender: "assistant",
        timestamp: new Date().toISOString(),
        type: "text",
        content: data.data.respond.human_response,
        sessionId: data.data.respond.session_id,
        database_json_response: data.data.respond.database_json_response,
        // Store the full response data for potential download
        responseData: data.data.respond,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Add quick replies if data is insufficient
      if (data.data.respond.insufficient_data) {
        const quickRepliesMessage = {
          id: `msg_${Date.now()}_quick_replies`,
          sender: "assistant",
          timestamp: new Date().toString(),
          type: "quick_reply_options",
          quickReplies: quickReplies,
        };

        setMessages((prev) => [...prev, quickRepliesMessage]);
      }
    } else if (status === apiResponseType.failed) {
      // Remove loading message
      setMessages((prev) => prev.filter((msg) => msg.type !== "loading"));

      // Add error message
      const errorMessage = {
        id: `msg_${Date.now()}`,
        sender: "assistant",
        timestamp: new Date().toString(),
        type: "text",
        content: "Sorry, I encountered an error. Please try again.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    }
  }, [status, data, error]);

  // const [text, setText] = useState("");
  // const [audioSrc, setAudioSrc] = useState("");
  // const [voiceChatLoading, setVoiceChatLoading] = useState(false);

  // const handleSpeak = async () => {
  //   if (!text.trim()) return;
  //   console.log("Text for TTS:", text);

  //   setVoiceChatLoading(true);
  //   const response = await fetch("http://localhost:5000/tts", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       text: text,
  //       lang: "gu",
  //     }),
  //   });

  //   // Blob response from API
  //   const blob = await response.blob();
  //   const url = URL.createObjectURL(blob);
  //   setAudioSrc(url);
  //   setVoiceChatLoading(false);
  // Custom components for markdown rendering
  // const markdownComponents = {
  //   h1: ({ children, ...props }) => (
  //     <h1
  //       className="text-3xl font-bold  mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
  //       {...props}
  //     >
  //       {children}
  //     </h1>
  //   ),
  //   h2: ({ children, ...props }) => (
  //     <h2 className="text-2xl font-bold  mt-6 mb-3" {...props}>
  //       {children}
  //     </h2>
  //   ),
  //   h3: ({ children, ...props }) => (
  //     <h3 className="text-xl font-semibold  mt-5 mb-2" {...props}>
  //       {children}
  //     </h3>
  //   ),
  //   h4: ({ children, ...props }) => (
  //     <h4 className="text-lg font-semibold  mt-4 mb-2" {...props}>
  //       {children}
  //     </h4>
  //   ),
  //   h5: ({ children, ...props }) => (
  //     <h5 className="text-base font-semibold  mt-3 mb-2" {...props}>
  //       {children}
  //     </h5>
  //   ),
  //   h6: ({ children, ...props }) => (
  //     <h6 className="text-sm font-semibold  mt-3 mb-2" {...props}>
  //       {children}
  //     </h6>
  //   ),

  //   // Custom paragraph component
  //   p: ({ children, ...props }) => (
  //     <p className="  dark:  leading-relaxed mb-4" {...props}>
  //       {children}
  //     </p>
  //   ),

  //   // Custom link component
  //   a: ({ children, href, ...props }) => (
  //     <a
  //       href={href}
  //       className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 underline transition-colors"
  //       target="_blank"
  //       rel="noopener noreferrer"
  //       {...props}
  //     >
  //       {children}
  //     </a>
  //   ),

  //   // Custom list components
  //   ul: ({ children, ...props }) => (
  //     <ul
  //       className="list-disc list-inside   dark:  mb-4 space-y-1 ml-4"
  //       {...props}
  //     >
  //       {children}
  //     </ul>
  //   ),
  //   ol: ({ children, ...props }) => (
  //     <ol
  //       className="list-decimal list-inside   dark:  mb-4 space-y-1 ml-4"
  //       {...props}
  //     >
  //       {children}
  //     </ol>
  //   ),
  //   li: ({ children, ...props }) => (
  //     <li className="mb-1" {...props}>
  //       {children}
  //     </li>
  //   ),
  //   // Custom blockquote component
  //   blockquote: ({ children, ...props }) => (
  //     <blockquote
  //       className="border-l-4 border-cyan-500 pl-4 py-2 my-4 bg-gray-50 dark:bg-gray-800 italic rounded-r"
  //       {...props}
  //     >
  //       {children}
  //     </blockquote>
  //   ),

  //   // Custom table components
  //   table: ({ children, ...props }) => (
  //     <div className="overflow-x-auto my-6">
  //       <table
  //         className="min-w-full border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
  //         {...props}
  //       >
  //         {children}
  //       </table>
  //     </div>
  //   ),
  //   thead: ({ children, ...props }) => (
  //     <thead className="bg-gray-100 dark:bg-gray-700" {...props}>
  //       {children}
  //     </thead>
  //   ),
  //   tbody: ({ children, ...props }) => (
  //     <tbody className="bg-white dark:bg-gray-800" {...props}>
  //       {children}
  //     </tbody>
  //   ),
  //   tr: ({ children, ...props }) => (
  //     <tr className="border-b border-gray-200 dark:border-gray-600" {...props}>
  //       {children}
  //     </tr>
  //   ),
  //   th: ({ children, ...props }) => (
  //     <th
  //       className="px-4 py-3 text-left font-semibold  border-r border-gray-300 dark:border-gray-600"
  //       {...props}
  //     >
  //       {children}
  //     </th>
  //   ),
  //   td: ({ children, ...props }) => (
  //     <td
  //       className="px-4 py-3   dark:  border-r border-gray-300 dark:border-gray-600"
  //       {...props}
  //     >
  //       {children}
  //     </td>
  //   ),

  //   // Custom image component
  //   img: ({ src, alt, ...props }) => (
  //     <div className="my-6">
  //       <img
  //         src={src}
  //         alt={alt}
  //         className="w-full rounded-lg shadow-lg max-w-full h-auto"
  //         {...props}
  //       />
  //       {alt && <p className="text-center text-sm mt-2 italic">{alt}</p>}
  //     </div>
  //   ),

  //   // Custom horizontal rule
  //   hr: ({ ...props }) => (
  //     <hr
  //       className="my-8 border-t-2 border-gray-200 dark:border-gray-700"
  //       {...props}
  //     />
  //   ),

  //   // Custom strong and em
  //   strong: ({ children, ...props }) => (
  //     <strong className="font-bold  e" {...props}>
  //       {children}
  //     </strong>
  //   ),
  //   em: ({ children, ...props }) => (
  //     <em className="italic   dark: " {...props}>
  //       {children}
  //     </em>
  //   ),

  //   // Custom div (for any divs in markdown)
  //   div: ({ children, ...props }) => (
  //     <div className="my-2" {...props}>
  //       {children}
  //     </div>
  //   ),
  // };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={() => {
        dispatch(resetApiState("chatApi"));
        setMessages([initialMessage]);
        setSessionId(null);
        onOpenChange();
      }}
    >
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <Dialog.Content
          className={cn(
            `fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md print:max-w-none rounded-lg bg-white shadow-xl focus:outline-none min-w-[740px] max-h-[85vh] min-h-[20vh] overflow-y-auto scrollable-element flex flex-col`
          )}
        >
          <div className="hidden">
            <Dialog.Title />
          </div>
          <div className="sticky top-0">
            <div className="relative backdrop-blur-custom text-white p-6">
              <div className="max-w-1/2 flex flex-col gap-2">
                <BlueCircularImage />
                <div>
                  <h3 className="text-base font-semibold">
                    Dhanvanatari Healthcare{" "}
                  </h3>
                  <p className="text-xs">
                    I'm here to help you resolve any Dhanvanatari Healthcare related
                    queries. Please select from the following options.
                  </p>
                </div>
              </div>

              {showClose && (
                <Dialog.Close asChild>
                  <button
                    className={cn("absolute top-5 right-5 cursor-pointer z-10")}
                  >
                    <CloseIcon className="h-8 w-8" />
                  </button>
                </Dialog.Close>
              )}
            </div>
          </div>

          <div
            ref={messagesContainerRef}
            className="px-6 py-4 flex flex-col gap-4 overflow-y-auto flex-grow"
          >
            {messages.map((m) => {
              return (
                <div
                  key={m.id}
                  className={cn(
                    "flex",
                    m.sender === "assistant" ? "justify-start" : "justify-end"
                  )}
                >
                  <div className="gap-2 text-sm text-blue flex">
                    {m.sender === "assistant" && (
                      <div>
                        <AIProfileIcon />
                      </div>
                    )}
                    <div className="flex flex-col w-full">
                      {m.sender === "assistant" && <span>Assistant</span>}
                      {m.content && (
                        <div
                          className={cn(
                            m.sender === "assistant"
                              ? "bg-extra-light-blue text-blue"
                              : "bg-blue text-white",
                            "rounded-lg p-2 whitespace-pre-line"
                          )}
                        >
                          <div>
                            <span className="text-xs text-[#0B4B8180]">
                              Session ID: {m.sessionId}
                            </span>
                          </div>
                          {/* {console.log(voiceChatLoading)}
                          {!m.database_json_response &&
                            m.sender === "assistant" &&
                            m.id !== "msg_001" && (
                              <div>
                                <SaveButton
                                  loading={voiceChatLoading}
                                  variant="dark"
                                  name={"Listen"}
                                  onClick={() => {
                                    setText(m.content);
                                    handleSpeak();
                                  }}
                                />
                                {audioSrc && (
                                  <audio
                                    controls
                                    autoPlay
                                    className="mt-4 w-full"
                                    src={audioSrc}
                                  />
                                )}
                              </div>
                            )} */}

                          {!m.database_json_response &&
                            JSON.parse(JSON.stringify(m.content))}
                          {/* Download button for database JSON responses */}
                          {m.database_json_response && (
                            <div className="mt-4 p-3 bg-white border border-blue/20 rounded-lg">
                              <p className="text-sm text-blue font-medium mb-2">
                                We have a large amount of data available for
                                your request.
                              </p>
                              <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 bg-blue text-white px-4 py-2 rounded-lg hover:bg-blue/90 transition-colors text-sm"
                              >
                                <DownloadIcon className="h-4 w-4" />
                                Download Data
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {m.type === "loading" && <ChatLoading />}
                      {m.timestamp && m.type !== "loading" && (
                        <span
                          className={cn(
                            "text-xs text-[#0B4B8180] my-0.5 flex items-center",
                            m.sender === "assistant"
                              ? "justify-start"
                              : "justify-end"
                          )}
                        >
                          {m.sender !== "assistant" && (
                            <DoubleTick className="h-5 w-5 mr-1" />
                          )}
                          {formatTimeToAMPM(m.timestamp)}
                        </span>
                      )}
                      {m.quickReplies && (
                        <div className="flex flex-col gap-2 p-2 rounded-lg bg-extra-light-blue mt-2">
                          {m.quickReplies.map((qr, i) => {
                            return (
                              <div
                                key={i}
                                className="rounded-lg p-2 bg-[#F8FBFF] border border-[#E1EFFD] cursor-pointer hover:bg-blue hover:text-white duration-300"
                                onClick={() => handleQuickReply(qr)}
                              >
                                {qr}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="py-4 px-6 bg-extra-light-blue w-full sticky bottom-0"
          >
            <CommonTextarea
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (e.ctrlKey) {
                    setValue("user_query", getValues("user_query") + "\n");
                    return;
                  } else {
                    // Prevent default to avoid new line
                    e.preventDefault();
                    handleSubmit(onSubmit)();
                  }
                }
              }}
              placeholder="Message..."
              id="user_query"
              name="user_query"
              register={register}
              errors={errors}
              className="flex items-end justify-between gap-4 border border-light-blue rounded-lg overflow-auto scrollbar-hide flex-col"
              textareaClassName="relative border text-blue focus:border-0 max-h-full"
              validation={{ required: "Message is required" }}
            >
              <button
                type="submit"
                className="absolute bottom-0 right-5 bg-blue rounded-full flex justify-center items-center p-3 cursor-pointer hover:bg-blue/90 duration-300 mr-2 mb-2"
                disabled={isLoading}
              >
                <RightArrowIcon className="h-5 w-5" />
              </button>
            </CommonTextarea>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ChatboxModal;
