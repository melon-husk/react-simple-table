import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { Icon } from "@iconify/react";
import styles from "./SimpleTable.module.css";

const SimpleTable = ({ json_data }: any) => {
  const [data, setData] = useState(json_data);
  const [trackHeaderOrder, setTrackHeaderOrder] = useState<
    { column_name: string; order: "asc" | "desc" }[]
  >([]);

  const sortData = (e: any) => {
    const column: string = e.currentTarget.getAttribute("data-column");
    // check if column exists in trackHeaderOrder
    const index = trackHeaderOrder.findIndex(
      (item) => item.column_name === column
    );
    if (index === -1) {
      // if column doesn't exist in trackHeaderOrder, add it
      setTrackHeaderOrder([
        ...trackHeaderOrder,
        { column_name: column, order: "asc" },
      ]);
      sortByType([{ column_name: column, order: "asc" }], column);
      // console.log([{ column_name: column, order: "asc" }], column);
    } else {
      // if column exists in trackHeaderOrder, change the order
      const newTrackHeaderOrder = [...trackHeaderOrder];
      newTrackHeaderOrder[index].order =
        newTrackHeaderOrder[index].order === "asc" ? "desc" : "asc";
      setTrackHeaderOrder([...newTrackHeaderOrder]);
      sortByType(newTrackHeaderOrder, column);
    }
  };

  const outputHeaders = (dataObject: object) => {
    const keys = Object.keys(dataObject);
    return keys.map((key) => {
      return (
        <th scope="col" key={uuid()} onClick={sortData} data-column={key}>
          <div className={styles["t-header"]}>
            <p>{key}</p>
            <Icon icon="bx:bxs-sort-alt" />
          </div>
        </th>
      );
    });
  };

  const outputDataRows = (dataArray: object[]) => {
    return dataArray.map((dataObject: any) => {
      const keys = Object.keys(dataObject);
      return (
        <tr key={uuid()}>
          {keys.map((key) => {
            return <td key={uuid()}>{dataObject[key]}</td>;
          })}
        </tr>
      );
    });
  };

  return (
    <table>
      <thead>
        <tr>{outputHeaders(data[0])}</tr>
      </thead>
      <tbody>{outputDataRows(data)}</tbody>
    </table>
  );

  function sortByType(
    newTrackHeaderOrder: { column_name: string; order: "asc" | "desc" }[],
    column: string
  ) {
    switch (
      newTrackHeaderOrder.find((item) => item.column_name === column)?.order
    ) {
      case "asc":
        if (typeof data[0][column] === "string") {
          setData([...sortByString(data, column, "desc")]);
        } else {
          setData([...sortByNumber(data, column, "desc")]);
          // console.log("in asc", [...sortByNumber(data, column, "desc")]);
        }
        break;
      case "desc":
        if (typeof data[0][column] === "string") {
          setData([...sortByString(data, column, "asc")]);
          // if column is a number, sort in descending order using - operator
        } else {
          setData([...sortByNumber(data, column, "asc")]);
        }
        break;

      default:
        break;
    }
  }
};

const sortByString = (
  array: object[],
  columnName: string,
  order: "asc" | "desc"
) => {
  if (order === "asc") {
    return array.sort((a: any, b: any) =>
      a[columnName].localeCompare(b[columnName])
    );
  } else {
    return array.sort((a: any, b: any) =>
      b[columnName].localeCompare(a[columnName])
    );
  }
};
const sortByNumber = (
  array: object[],
  columnName: string,
  order: "asc" | "desc"
) => {
  if (order === "asc") {
    return array.sort((a: any, b: any) => a[columnName] - b[columnName]);
  } else {
    return array.sort((a: any, b: any) => b[columnName] - a[columnName]);
  }
};

export default SimpleTable;
