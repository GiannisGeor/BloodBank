import { Form, message, Modal, Radio } from "antd";
import React, { useState } from "react";
import { getAntdInputValidation } from "../../utils/helpers";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import { AddInventory } from "../../apicalls/inventory";

function InventoryForm({ open, setOpen, reloadData }) {
  const [form] = Form.useForm();
  const [inventoryType, setInventoryType] = useState("in");
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      const response = await AddInventory({
        ...values,
        inventoryType,
      });
      dispatch(SetLoading(false));
      if (response.success) {
        message.success("Inventory Added Successfully");
        setOpen(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  return (
    <Modal
      title="Προσθήκη αποθέματος"
      open={open}
      onCancel={() => setOpen(false)}
      centered
      onOk={() => {
        form.submit();
      }}
    >
      <Form
        layout="vertical"
        className="flex flex-col gap-3"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item label="Τύπος αποθέματος">
          <Radio.Group
            value={inventoryType}
            onChange={(e) => setInventoryType(e.target.value)}
          >
            <Radio value="in">Εισερχόμενα</Radio>
            <Radio value="out">Εξερχόμενα</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Ομάδα Αίματος"
          name="bloodGroup"
          rules={getAntdInputValidation()}
        >
          <select name="" id="">
            <option value="a+">A+</option>
            <option value="a-">A-</option>
            <option value="b+">B+</option>
            <option value="b-">B-</option>
            <option value="o+">AB+</option>
            <option value="o-">AB-</option>
            <option value="ab+">O+</option>
            <option value="ab-">O-</option>
          </select>
        </Form.Item>

        <Form.Item
          label={
            inventoryType === "out" ? "Email Νοσοκομείου" : "Email Αιμοδότη"
          }
          name="email"
          rules={getAntdInputValidation()}
        >
          <input type="email" />
        </Form.Item>

        <Form.Item
          label="Ποσότητα(ml)"
          name="quantity"
          rules={getAntdInputValidation()}
        >
          <input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default InventoryForm;
