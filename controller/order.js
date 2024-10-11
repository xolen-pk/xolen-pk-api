import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    // Extract data from the request body
    const {
      user,
      products,
      totalPrice,
      address,
      Quantity,
      paymentMethod,
      coupon,
    } = req.body;

    // Validate the data
    if (!user) {
      return res.status(400).json({ message: "User is required" });
    }
    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Products are required" });
    }
    if (totalPrice == null) {
      return res.status(400).json({ message: "Total price is required" });
    }
    if (!address) {
      return res.status(400).json({ message: "Shipping address is required" });
    }
    if (Quantity == null) {
      return res.status(400).json({ message: "Quantity is required" });
    }
    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }

    // Create a new order instance
    const newOrder = new Order({
      user,
      products,
      totalPrice,
      address,
      Quantity,
      paymentMethod,
      coupon,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Respond with the saved order
    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrders = async (req, res) => {
  try {
    // Find all orders in the database
    const orders = await Order.find();

    // Respond with the orders
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    // Extract the order ID from the request parameters
    const { id } = req.params;

    // Find the order with the given ID
    const order = await Order.findById(id);

    // Validate the order
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Respond with the order
    res.status(200).json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params; // Extract order ID from route parameters
    const updates = req.body; // Extract data from the request body

    // Validate order ID
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    // Validate updates (you can customize this validation based on your requirements)
    const {
      user,
      products,
      totalPrice,
      address,
      Quantity,
      paymentMethod,
      coupon,
    } = updates;
    if (
      !user &&
      !products &&
      !totalPrice &&
      !address &&
      !Quantity &&
      !paymentMethod &&
      !coupon
    ) {
      return res
        .status(400)
        .json({ message: "At least one field to update is required" });
    }

    // Find and update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updates,
      { new: true, runValidators: true } // Return the updated document and run validation
    );

    // Check if the order was found and updated
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Respond with the updated order
    res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    // Extract the order ID from the request parameters
    const { id } = req.params;

    // Find the order with the given ID and delete it
    const deletedOrder = await Order.findByIdAndDelete(id);

    // Validate the order
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Respond with the deleted order
    res.status(200).json({
      message: "Order deleted successfully",
      order: deletedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    // Extract the user ID from the request parameters
    const { userId } = req.params;

    // Find all orders for the given user
    const orders = await Order.find({ user: userId });

    // Respond with the orders
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderCount = async (req, res) => {
  try {
    // Get the total number of orders in the database
    const orderCount = await Order.countDocuments();

    // Respond with the order count
    res.status(200).json({ orderCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrdersByStatus = async (req, res) => {
  try {
    // Extract the status from the request parameters
    const { status } = req.params;

    // Find all orders with the given status
    const orders = await Order.find({ status });

    // Respond with the orders
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
