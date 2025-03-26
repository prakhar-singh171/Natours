const OverviewBox = ({ label, text, icon }) => {
    return (
      <div className="flex items-center space-x-2">
        <svg className="w-6 h-6 text-green-500">
          <use xlinkHref={`/img/icons.svg#icon-${icon}`} />
        </svg>
        <div>
          <span className="block font-bold text-gray-700">{label}</span>
          <span className="text-gray-600">{text}</span>
        </div>
      </div>
    );
  };

  export default OverviewBox