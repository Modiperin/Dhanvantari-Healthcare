// import Slider from "react-slider";
import { Slider } from "antd";

const DoubleRangeSlider = ({ label, min, max, step = 1, value, onChange }) => {
  const handleSliderChange = (newValues) => {
    onChange(newValues);
  };

  const handleMinChange = (e) => {
    const newMin = Math.max(0, Math.min(+e.target.value, value[1] - step));
    onChange([newMin, value[1]]);
  };

  const handleMaxChange = (e) => {
    const newMax = Math.min(max, Math.max(+e.target.value, 0));
    onChange([value[0], newMax]);
  };

  return (
    <div className="flex gap-3 flex-col w-full max-w-md text-blue">
      <label className="font-medium">{label}</label>
      <Slider
        value={value}
        onChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
      />

      <div className="flex w-full justify-between items-center gap-6 text-xs">
        <div className="flex flex-col">
          <label htmlFor={`min${label}`} className="mb-1">
            Min:
          </label>
          <input
            type="number"
            id={`min${label}`}
            value={value[0]}
            onChange={handleMinChange}
            className="w-20 px-2 py-1 border rounded"
            min={min}
            max={value[1] - step}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor={`max${label}`} className="mb-1">
            Max:
          </label>
          <input
            type="number"
            id={`max${label}`}
            value={value[1]}
            onChange={handleMaxChange}
            className="w-20 px-2 py-1 border rounded"
            // min={value[0] + step}
            max={max}
          />
        </div>
      </div>
    </div>
  );
};

export default DoubleRangeSlider;
