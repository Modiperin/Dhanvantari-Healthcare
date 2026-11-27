import { formatDateToReadable } from "../../../utils/common";

const Card = ({ title, date, url, desc, withoutDate }) => {
  return (
    <div className="p-2 border border-light-blue rounded-lg text-xs lg:text-sm w-full flex flex-col gap-2 text-blue">
      {date && (
        <div className="border-b border-light-blue text-blue text-sm lg:text-base">
          {formatDateToReadable(date, withoutDate)}
        </div>
      )}
      <div className="flex flex-col">
        {title && (
          <div className="font-medium text-sm lg:text-base capitalize">
            {title}
          </div>
        )}
        {desc && <div>{desc}</div>}
        {url && (
          <a
            href={url}
            target="_blank"
            className="text-blue-500 w-fit border-b hover:border-blue-600 cursor-pointer focus:text-blue-600 hover:text-blue-600 duration-300"
          >
            {url}
          </a>
        )}
      </div>
    </div>
  );
};

export default Card;
