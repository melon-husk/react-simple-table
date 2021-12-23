import React, { Dispatch, useEffect } from "react";
import styles from "./TableRow.module.css";
import { Icon } from "@iconify/react";
import { v4 as uuid } from "uuid";
import DateTimePicker from "react-datetime-picker";

type Props = {
  RowData: object;
  editable?: boolean;
  dispatch: Dispatch<any>;
};

const TableRow = ({ RowData, dispatch, editable = false }: Props) => {
  // make the row editable
  const [isEditable, setIsEditable] = React.useState(false);
  const [rowData, setRowData] = React.useState(RowData);

  const keys = Object.keys(RowData);
  const filteredKeys = keys.filter((key) => key[0] !== "_");

  // Add Action key to the end
  const newKeys = ["_id", ...filteredKeys, "Action"];

  const onChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setRowData({ ...rowData, [key]: e.target.value });
  };
  // Dispatch update action to reducer when isEditable switch from true to false
  const onSave = () => {
    setIsEditable(false);
    dispatch({
      type: "UPDATE_ROW",
      payload: { _uuid: rowData["_uuid"], data: rowData },
    });
  };
  const onDelete = () => {
    dispatch({
      type: "DELETE_ROW",
      _uuid: rowData["_uuid"],
    });
  };
  return (
    <tr>
      {newKeys.map((key, index) => {
        // if key is Action column, add edit and delete buttons
        if (key === "Action") {
          return (
            <td key={uuid()}>
              <div className={styles.action}>
                {isEditable ? (
                  <Icon icon="ant-design:save-outlined" onClick={onSave} />
                ) : (
                  <Icon
                    icon="bx:bxs-edit"
                    onClick={() => setIsEditable(true)}
                  />
                )}
                <Icon
                  icon="bx:bxs-trash"
                  className={styles["t-action-delete"]}
                  onClick={onDelete}
                />
              </div>
            </td>
          );
        }
        // Date picker
        if (key === "date") {
          return (
            <td
              style={
                {
                  // background: `${rowData["_bg"] ? rowData["_bg"] : ""}`,
                  // color: `${dataObject._color ? dataObject._color : ""}`,
                }
              }
              key={`${rowData["_uuid"]}` + index}
            >
              {isEditable ? (
                <input
                  type={"date"}
                  value={rowData[key]}
                  onChange={(e) => onChange(e, key)}
                />
              ) : (
                rowData[key]
              )}
            </td>
          );
        }
        // Made Roll No. uneditable
        if (key === "_id") {
          return (
            <td
              style={
                {
                  // background: `${rowData["_bg"] ? rowData["_bg"] : ""}`,
                  // color: `${dataObject._color ? dataObject._color : ""}`,
                }
              }
              key={`${rowData["_uuid"]}` + index}
            >
              {rowData[key]}
            </td>
          );
        }
        return (
          <td
            style={
              {
                // background: `${rowData["_bg"] ? rowData["_bg"] : ""}`,
                // color: `${dataObject._color ? dataObject._color : ""}`,
              }
            }
            key={`${rowData["_uuid"]}` + index}
          >
            {isEditable ? (
              <input
                type={"text"}
                value={rowData[key]}
                onChange={(e) => onChange(e, key)}
              />
            ) : (
              rowData[key]
            )}
          </td>
        );
      })}
    </tr>
  );
};

export default TableRow;
