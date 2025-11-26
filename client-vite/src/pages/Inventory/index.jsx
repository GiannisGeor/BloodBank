import React from "react";
import InventoryForm from "./InventoryForm";
import { Button, message, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { GetInventory } from "../../apicalls/inventory";
import { SetLoading } from "../../redux/loadersSlice";
import { getDateFormat } from "../../utils/helpers";

function Inventory() {
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);

  const columns = [
    {
      title: "Inventory Type",
      dataIndex: "inventoryType",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (text) => text + "ML",
    },
    {
      title: "Reference",
      dataIndex: "reference",
      render: (text, record) => {
        if (record.inventoryType === "in") {
          return record.donor?.name;
        } else {
          return record.hospital?.hospitalName;
        }
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
  ];

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetInventory();
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
    if (currentUser) {
      getData();
    }
  }, [currentUser?._id]);

  return (
    <div className="px-2 sm:px-0">
      <div className="flex justify-end mb-3">
        <Button type="default" onClick={() => setOpen(true)}>
          Προσθήκη Αποθέματος
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table columns={columns} dataSource={data} scroll={{ x: 800 }} />
      </div>

      {open && (
        <InventoryForm open={open} setOpen={setOpen} reloadData={getData} />
      )}
    </div>
  );
}

export default Inventory;
