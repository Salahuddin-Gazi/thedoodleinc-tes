import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col flex-1 items-center justify-center mt-[50px]">
      <h1>Loading ... </h1>
      <div id="outer">
        <div id="middle">
          <div id="inner"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
