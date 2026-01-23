import React, { useState } from "react";
import {
  useCSVReader,
  lightenDarkenColor,
  formatFileSize,
} from "react-papaparse";
import "./UploadFile.scss";

const GREY = "#CCC";
const DEFAULT_REMOVE_HOVER_COLOR = "#A01919";
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
  DEFAULT_REMOVE_HOVER_COLOR,
  40
);

const UploadFile: React.FC = () => {
  const { CSVReader } = useCSVReader();
  const [zoneHover, setZoneHover] = useState(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR
  );

  return (
    <CSVReader
      onUploadAccepted={(results: any) => {
        console.log("File uploaded:", results);
        setZoneHover(false);
      }}
      onDragOver={(event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setZoneHover(true);
      }}
      onDragLeave={(event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setZoneHover(false);
      }}
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
        Remove,
      }: {
        getRootProps: () => any;
        acceptedFile: File | null;
        ProgressBar: React.ComponentType;
        getRemoveFileProps: () => any;
        Remove: React.ComponentType<{ color: string }>;
      }) => (
        <div
          {...getRootProps()}
          className={`upload-zone ${zoneHover ? "zone-hover" : ""}`}
        >
          {acceptedFile ? (
            <div className="upload-file">
              <div className="upload-info">
                <span className="upload-size">
                  {formatFileSize(acceptedFile.size)}
                </span>
                <span className="upload-name">{acceptedFile.name}</span>
              </div>

              <div className="upload-progress">
                <ProgressBar />
              </div>

              <div
                {...getRemoveFileProps()}
                className="upload-remove"
                onMouseEnter={() =>
                  setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT)
                }
                onMouseLeave={() =>
                  setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR)
                }
              >
                <Remove color={removeHoverColor} />
              </div>
            </div>
          ) : (
            <span>Drop CSV file here or click to upload</span>
          )}
        </div>
      )}
    </CSVReader>
  );
};

export default UploadFile;
