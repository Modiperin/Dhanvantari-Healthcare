import { useRef, useEffect, useState } from "react";
import AccordionToggleIcon from "./AccordionToggleIcon";
import { cn } from "../../../lib/utils";
import IconButton from "../../../components/IconButton";
import ThreeDot from "../../../assets/svg/horizontal-dots.svg?react";
import UserIcon from "../../../assets/svg/user.svg?react";
import Card from "../components/Card";
import { dobToAge } from "../../../utils/common";
import Divider from "../../../components/Divider";
import getPlatformIcon from "../../../components/GetPlateformIcon";
import ActionDropdown from "../../../components/ActionDropdown";
import useNavigateTo from "../../../hooks/useNavigateTo";
import { ROUTES } from "../../../routes/helper";
import VerticalLine from "../../../components/lines/VerticalLine";
import Badge from "../../../components/Budge";
import NormalTableView from "../../../components/table/NormalTableView";

const AccordionItem = ({
  setResetModalOpen,
  handleDeleteClick,
  item,
  isOpen,
  onClick,
}) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const goTo = useNavigateTo();
  const {
    userId: id,
    name,
    titleName,
    gender,
    dateOfBirth,
    qualifications,
    specialities,
    active,
    type,
    bio,
    departmentData,
    registrationNo,
    experience,
    awards = [],
    publications = [],
    socialLinks = [],
  } = item;

  // Define options inside the component to access state setters
  const options = [
    {
      label: "Edit",
      onClick: () => {
        goTo(`${ROUTES.DOCTOR_UPDATE}/${id}`);
      },
    },
    {
      label: "Delete",
      onClick: () => {
        handleDeleteClick(id);
      },
    },
    {
      label: "Reset Password",
      onClick: () => {
        setResetModalOpen(id);
      },
    },
  ];

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen]);

  return (
    <div id={`heading-${id}`}>
      <div
        className={cn(
          "accordion-toggle group inline-flex items-center justify-between w-full transition duration-300 text-xs lg:text-sm",
          isOpen && "text-indigo-600"
        )}
        onClick={onClick}
        aria-controls={`collapse-${id}`}
        aria-expanded={isOpen}
      >
        <div className="relative flex items-center justify-between w-full border border-light-blue rounded-lg p-3 text-blue/75 cursor-pointer ">
          <div className="flex gap-2 items-start">
            <div>
              <span className="flex items-center gap-2 mb-2 text-blue">
                <UserIcon />
                <span className="font-medium text-sm lg:text-base text-nowrap max-w-80 overflow-x-scroll scrollbar-hide">
                  {titleName?.concat(" ")}
                  {name}
                </span>

                {/* <span>|</span> */}
                <VerticalLine />
                <span className="capitalize">{gender}</span>
                {/* <span>|</span> */}
                <VerticalLine />
                <span>{dobToAge(dateOfBirth)} year(s)</span>
              </span>
              <Divider items={qualifications} separator="|" />
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex flex-col items-end">
              <Divider items={specialities} />
              <div className="flex items-center justify-end gap-2 mt-2">
                <Badge type="doctor-timing" title={type} />
                <Badge type={active ? "active" : "inactive"} />
              </div>
            </div>

            {/* Fixed Action Menu */}
            <div className="flex items-center gap-2">
              <ActionDropdown
                actions={options}
                open={dropdownOpen}
                onOpenChange={setDropdownOpen}
              >
                <ThreeDot
                  className="relative rotate-90 h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen((open) => !open);
                  }}
                />
              </ActionDropdown>
              <AccordionToggleIcon isOpen={isOpen} />
            </div>
          </div>
        </div>
      </div>

      <div
        id={`collapse-${id}`}
        ref={contentRef}
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out transform px-0 w-full",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
        )}
        style={{ maxHeight: height }}
        aria-labelledby={`heading-${id}`}
      >
        <div className="border border-light-blue rounded-lg flex flex-col text-blue/75 p-4">
          <h2 className="text-base lg:text-lg text-blue">
            Professional Summary
          </h2>
          <span className="text-justify pb-1 text-sm lg:text-base">{bio}</span>
          <NormalTableView
            data={{
              "Department Name": departmentData?.name || "Not Assigned",
              "Registration No": registrationNo || "N/A",
              Speciality: specialities || [],
              Qualifications: qualifications || [],
              Experience: experience + " years" || "Not provided",
            }}
          />

          {awards.length > 0 && (
            <>
              <h2 className="text-base lg:text-lg title">Awards</h2>
              <div className="grid grid-cols-2 items-center justify-between gap-2 w-full">
                {awards.map((award, i) => (
                  <Card
                    key={i}
                    date={award.date}
                    title={award.awardName}
                    desc={award.awardedBy}
                  />
                ))}
              </div>
            </>
          )}

          {publications.length > 0 && (
            <>
              <h2 className="text-base lg:text-lg title">Publications</h2>
              <div className="grid grid-cols-2 items-center justify-between gap-2">
                {publications.map((publication, i) => (
                  <Card
                    key={i}
                    date={publication.publicationDate}
                    title={publication.title}
                    desc={publication.journal}
                    url={publication.url}
                    withoutDate
                  />
                ))}
              </div>
            </>
          )}

          {socialLinks.length > 0 && (
            <>
              <h2 className="text-base lg:text-lg title">Social Media Links</h2>
              <div className="flex items-center gap-2 lg:gap-4">
                {socialLinks.map((s, i) => (
                  <div
                    key={s.name + i}
                    onClick={() => window.open(s.url, "_blank")}
                  >
                    {getPlatformIcon(s.name)}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
