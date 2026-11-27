import { useEffect, useState } from "react";
import Button from "./Buttons/Button";
import CommonInput from "./CommonInput";
import CommonTextarea from "./CommonTextarea";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  createFeatureRequest,
  getFeatureRequestsList,
} from "../slices/topBarSlice";
import Spinner from "./Spinner";
import {
  multipleErrorToastMessage,
  successToastMessage,
} from "../utils/toastMessage";
import { formatDate } from "../utils/dateAndTime";
import Pagination from "./Pagination";
import Skeleton from "./Skeleton";
import { EmptyData } from "../components/EmptyData";

const getStatusClass = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Reviewing":
      return "bg-purple-100 text-purple-800";
    case "Developing":
      return "bg-blue-100 text-blue-800";
    case "Developed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const FeatureRequestItem = ({ item }) => {
  return (
    <div className="border border-light-blue rounded-lg p-3 text-sm">
      <div className="flex justify-between">
        <div>
          <h3 className="text-base font-semibold text-blue mb-2">
            {item.title}
          </h3>
          <p className="text-blue/70 mb-2">{item.description}</p>
        </div>
        <div className="flex flex-col gap-2">
          <span
            className={`${getStatusClass(item.status)} p-2 rounded-md text-xs`}
          >
            {item.status}
          </span>
          <span className="text-xs">
            {formatDate(item.createdAt, "dd MMM yyyy")}
          </span>
        </div>
      </div>
    </div>
  );
};

const RequestNewFeaturesModalSkeleton = () => (
  <div className="flex flex-col space-y-4 p-4 animate-pulse">
    {/* Header Button Skeleton */}
    <div className="flex justify-end mb-4">
      <Skeleton className="h-10 w-32 rounded" />
    </div>

    {/* Feature Request Items Skeleton */}
    <div className="space-y-3">
      {[...Array(4)].map((_, idx) => (
        <div key={idx} className="border border-light-blue rounded-lg p-3">
          <div className="flex justify-between">
            {/* Left Content */}
            <div className="flex-1 min-w-0">
              {/* Title Skeleton */}
              <Skeleton className="h-5 w-3/4 mb-2 rounded" />
              {/* Description Skeleton */}
              <Skeleton className="h-4 w-full mb-1 rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
            </div>

            {/* Right Content */}
            <div className="flex flex-col gap-2 ml-4">
              {/* Status Badge Skeleton */}
              <Skeleton className="h-6 w-20 rounded-md" />
              {/* Date Skeleton */}
              <Skeleton className="h-4 w-24 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="flex justify-end mb-4">
      <Skeleton className="h-10 w-32 rounded" />
    </div>
  </div>
);

const RequestNewFeaturesModal = ({ open = "", onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreateNewFeature, setIsCreateNewFeature] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const createFeatureRequestApi = useSelector(
    (state) => state.topBar.createFeatureRequestApi
  );
  const featureRequestsListApi = useSelector(
    (state) => state.topBar.getFeatureRequestsApi
  );

  const isCreateLoading = createFeatureRequestApi?.isLoading;
  const isListLoading = featureRequestsListApi?.isLoading;

  const {
    totalPages = 1,
    totalRecords = 0,
    pageLimit = 5,
    list = [],
  } = featureRequestsListApi?.data?.response || {};

  // const list = featureRequestsListApi?.data?.response?.list || [];

  const featchFeatureRequests = () => {
    dispatch(getFeatureRequestsList({ page: currentPage }));
  };

  useEffect(() => {
    featchFeatureRequests();
  }, [currentPage]);

  const handleNewFeatureRequest = () => {
    dispatch(createFeatureRequest({ title, description }));
  };

  useEffect(() => {
    if (
      createFeatureRequestApi &&
      createFeatureRequestApi.status === "success"
    ) {
      featchFeatureRequests();
      successToastMessage("Feature request created successfully");
      setIsCreateNewFeature(false);
    } else if (
      createFeatureRequestApi &&
      createFeatureRequestApi.status === "failed"
    ) {
      multipleErrorToastMessage(createFeatureRequestApi);
    }
  }, [createFeatureRequestApi]);

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title={
        <span className="text-blue text-xl">
          {isCreateNewFeature ? "Request New Feature" : "Requested Features"}
        </span>
      }
      contentClassName="min-h-[650px] overflow-y-auto min-w-[90%] lg:min-w-[900px]"
      className=""
      showClose
    >
      {isCreateNewFeature ? (
        <div className="flex flex-col gap-4 p-4 text-blue">
          {/* <p>Request New Feature</p> */}
          <div>
            <label htmlFor="new-feature" className="text-sm text-blue mb-2">
              Feature Title
            </label>
            <br />
            <CommonInput
              id={"new-feature"}
              name={"title"}
              value={title}
              onChange={(value) => setTitle(value)}
            />
          </div>
          <div>
            <label htmlFor="feature-desc" className="text-sm text-blue mb-2">
              Feature Description
            </label>
            <CommonTextarea
              id={"feature-desc"}
              name={"description"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button
              variant="light"
              onClick={() => setIsCreateNewFeature(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue text-white px-4 py-2 rounded-md ml-4"
              disabled={!title || !description}
              onClick={handleNewFeatureRequest}
            >
              {isCreateLoading ? <Spinner /> : "Submit"}
            </Button>
          </div>
        </div>
      ) : isListLoading ? (
        <RequestNewFeaturesModalSkeleton />
      ) : (
        <div className="flex flex-col text-blue">
          <div className="flex flex-col p-2 gap-2">
            {list.length ? (
              list.map((item) => (
                <FeatureRequestItem key={item._id} item={item} />
              ))
            ) : (
              <>
                <EmptyData from="featureRequest" />
                <div className="flex justify-center mt-4">
                  <Button onClick={() => setIsCreateNewFeature(true)}>
                    Suggest a Feature
                  </Button>
                </div>
              </>
            )}

            {list.length ? (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRecords={totalRecords}
                pageLimit={pageLimit}
                onPageChange={(page) => setCurrentPage(page)}
              />
            ) : null}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default RequestNewFeaturesModal;
