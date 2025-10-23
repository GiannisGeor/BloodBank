import React from "react";
import { GetInventoryWithFilters } from "../apicalls/inventory";
import { useDispatch } from "react-redux";
import { getDateFormat } from "../utils/helpers";
import { SetLoading } from "../redux/loadersSlice";
import { message, Table } from "antd";

function InventoryTable({ filters, userType, limit }) {
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const columns = [
    {
      title: "Inventory Type",
      dataIndex: "inventoryType",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Ομάδα Αίματος ",
      dataIndex: "bloodGroup",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Ποσότητα",
      dataIndex: "quantity",
      render: (text) => text + "ML",
    },
    {
      title: "Αναφορά",
      dataIndex: "reference",
      render: (text, record) => {
        if (userType === "organization") {
          return record.inventoryType === "in"
            ? record.donor?.name
            : record.hospital?.hospitalName;
        } else {
          return record.organization.organizationName;
        }
      },
    },
    {
      title: "Ημερομηνία",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
  ];

  //change columns for hOspital or donor
  if (userType !== "organization") {
    //remove inventory column
    columns.splice(0, 1);
    //change ref column to org name
    columns[2].title = "Οργανισμός";

    //Date column to taken date
    columns[3].title =
      userType === "hospital" ? "Ημερομηνία Ανάληψης" : "Ημερομηνία Αιμοδοσίας";
  }

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetInventoryWithFilters(filters, limit);
      dispatch(SetLoading(false));
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  React.useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <Table columns={columns} dataSource={data} className="mt-3" />
    </div>
  );
}

export default InventoryTable;
