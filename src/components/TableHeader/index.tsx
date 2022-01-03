import React, { useState } from "react";
import { Icon } from "@iconify/react";
import styles from "./TableHeader.module.css";

// type Props = {
//   filterFunction: () => void;
//   dataObject: any;
// };

const TableHeader = ({
  dataObject,
  sortFunction,
  filterObject,
  setFilterObject,
}) => {
  const keys = Object.keys(dataObject);
  // filter out _ properties
  const filteredKeys = keys.filter((key) => key[0] !== "_");
  // add Action column
  // add Row No. column
  const newKeys = ["#", ...filteredKeys, "Action"];
  return (
    <>
      {newKeys.map((key, index) => {
        return (
          <TableHeaderCell
            label={key}
            sortFunction={sortFunction}
            key={`${key}_${index}`}
            globalFilterObject={filterObject}
            setGlobalFilterObject={setFilterObject}
          />
        );
      })}
    </>
  );
};

const TableHeaderCell = ({
  label,
  sortFunction,
  globalFilterObject,
  setGlobalFilterObject,
}) => {
  const [filterObject, setFilterObject] = useState({
    column: label,
    value: "",
    isFiltering: false,
  });
  const handleOnClick = () => {
    setFilterObject({ column: label, value: "", isFiltering: true });
    setGlobalFilterObject({ column: label, value: "", isFiltering: true });
  };
  const handleOnChange = (e) => {
    setFilterObject({
      column: label,
      value: e.target.value,
      isFiltering: true,
    });
    setGlobalFilterObject({
      column: label,
      value: e.target.value,
      isFiltering: true,
    });
  };
  const handleOnBlur = () => {
    setFilterObject({
      column: label,
      value: "",
      isFiltering: false,
    });
    setGlobalFilterObject({
      column: label,
      value: "",
      isFiltering: false,
    });
  };
  if (label === "#") {
    return (
      <th scope="col">
        <div className={styles["t-header-row"]}>
          <p>{label}</p>
        </div>
      </th>
    );
  }
  return (
    <th scope="col">
      <div className={styles["t-header"]}>
        {filterObject.isFiltering ? (
          <>
            <input
              type="text"
              placeholder={label}
              value={filterObject.value}
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              autoFocus
            />
          </>
        ) : (
          <>
            <p onClick={handleOnClick}>{label}</p>
            <Icon
              icon="bx:bxs-sort-alt"
              onClick={sortFunction}
              data-column={label}
            />
          </>
        )}
        {/* <p>{label}</p>
        <Icon
          icon="bx:bxs-sort-alt"
          onClick={sortFunction}
          data-column={label}
        /> */}
      </div>
    </th>
  );
};

export default TableHeader;
