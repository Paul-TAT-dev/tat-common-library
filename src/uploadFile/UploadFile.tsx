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

interface UploadFileProps {
  onUploadAccepted?: (results: unknown) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ onUploadAccepted }) => {
  const { CSVReader } = useCSVReader();
  const [zoneHover, setZoneHover] = useState(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR
  );

  return (
    <CSVReader
      onUploadAccepted={(results: unknown) => {
        onUploadAccepted?.(results);
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
          className={`tat-upload ${zoneHover ? "is-dragging" : ""}`}
        >
          {acceptedFile ? (
            <div className="tat-upload-file">
              <div className="tat-upload-info">
                <span className="tat-upload-size">
                  {formatFileSize(acceptedFile.size)}
                </span>
                <span className="tat-upload-name">{acceptedFile.name}</span>
              </div>

              <div className="tat-upload-progress">
                <ProgressBar />
              </div>

              <div
                {...getRemoveFileProps()}
                className="tat-upload-remove"
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
