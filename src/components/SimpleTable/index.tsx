import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { Icon } from "@iconify/react";
import styles from "./SimpleTable.module.css";
import TableRow from "../TableRow";
import TableHeader from "../TableHeader";

type Props = {
  json_data: object[];
  config?: object;
};
const defaultConfig = {};
//  {
//   "_uuid": "0b1dbdf6-9a26-46c1-89d9-a9d4e10a9ccf",
//   "_id": 99,
//   "_bg": "#fc468c",
//   "_color": "#f7995d",
//   "first_name": "Jobey",
//   "last_name": "Sarjent",
//   "date": "2021-08-06",
//   "email": "jsarjent2q@icio.us",
//   "gender": "Bigender"
// }
function reducer(state, action) {
  switch (action.type) {
    case "SET_DATA":
      return action.payload;
    case "UPDATE_ROW":
      const { _uuid, data } = action.payload;
      return state.map((row) => {
        if (row._uuid === _uuid) {
          return { ...row, ...data };
        }
        return row;
      });

    case "DELETE_ROW":
      return state.filter((row) => row._uuid !== action._uuid);

    default:
      return state;
  }
}
const SimpleTable = ({ json_data, config = defaultConfig }: Props) => {
  const [data, dispatch] = React.useReducer(reducer, json_data);
  const [filterObject, setFilterObject] = useState({
    column: "",
    value: "",
    isFiltering: false,
  });

  // const [data, setData] = useState(json_data);
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
  // add Action column at the end
  // Filter _ properties
  // Add pagination
  const outputHeaders = (dataObject: any) => {
    const keys = Object.keys(dataObject);
    // filter out _ properties
    const filteredKeys = keys.filter((key) => key[0] !== "_");
    // add Action column
    // add Row No. column
    const newKeys = ["#", ...filteredKeys, "Action"];

    return newKeys.map((key) => {
      if (key === "#") {
        return (
          <th scope="col" key={uuid()}>
            <div className={styles["t-header-row"]}>
              <p>{key}</p>
            </div>
          </th>
        );
      }
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
  // if _color, _bg is present, set bg to that color
  const outputDataRows = (dataArray: any) => {
    return dataArray.map((dataObject: any) => {
      return (
        <TableRow
          RowData={dataObject}
          editable={false}
          key={uuid()}
          dispatch={dispatch}
        />
      );
    });
  };
  const filteredDataRows = (dataArray: any) => {
    // if filterObject is not hydrated, return all data
    if (!filterObject.column || !filterObject.value) {
      return outputDataRows(dataArray);
    }
    console.log({ filterObject });
    const filteredDataArray = dataArray.filter((dataObject: any) => {
      return dataObject[filterObject.column]
        .toString()
        .toLowerCase()
        .includes(filterObject.value.toLowerCase());
    });
    console.log(filteredDataArray);
    return outputDataRows(filteredDataArray);
  };
  return (
    <table>
      <thead>
        <tr>
          <TableHeader
            dataObject={data[0]}
            sortFunction={sortData}
            filterObject={filterObject}
            setFilterObject={setFilterObject}
          />
        </tr>
      </thead>
      <tbody>
        {filterObject.isFiltering
          ? filteredDataRows(data)
          : outputDataRows(data)}
      </tbody>
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
          dispatch({
            type: "SET_DATA",
            payload: [...sortByString(data, column, "desc")],
          });
          // setData([...sortByString(data, column, "desc")]);
        } else {
          dispatch({
            type: "SET_DATA",
            payload: [...sortByNumber(data, column, "desc")],
          });

          // setData([...sortByNumber(data, column, "desc")]);
          // console.log("in asc", [...sortByNumber(data, column, "desc")]);
        }
        break;
      case "desc":
        if (typeof data[0][column] === "string") {
          dispatch({
            type: "SET_DATA",
            payload: [...sortByString(data, column, "asc")],
          });

          // setData([...sortByString(data, column, "asc")]);
          // if column is a number, sort in descending order using - operator
        } else {
          dispatch({
            type: "SET_DATA",
            payload: [...sortByNumber(data, column, "asc")],
          });
          // setData([...sortByNumber(data, column, "asc")]);
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
