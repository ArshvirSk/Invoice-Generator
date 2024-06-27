/* eslint-disable react/no-unescaped-entities */
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { products as initproducts } from "./constants";

const Home = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState(initproducts);
  const [checkedProducts, setCheckedProducts] = useState({});
  const [quantities, setQuantities] = useState({});
  const [sameState, setSameState] = useState(false);
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  const invoiceInfo = {
    order_no: str_Random(10),
    invoice_no: str_Random(10),
    invoice_date: `${year}-${month}-${day}`,
  };

  const [customerBill, setCustomerBill] = useState({
    bill_name: "Arshvir Singh Kalsi",
    bill_address: "Bandra, Mumbai",
    bill_state_id: "17",
  });

  const [customerShip, setCustomerShip] = useState({
    ship_name: "John Doe",
    ship_address: "Pune",
    ship_state_id: "17",
    place_to_deliver: "Maharashtra",
    order_date: "2024-06-21",
  });

  const [supplier, setSupplier] = useState({
    company_logo: "/assets/logo.png",
    seller_name: "Win Supply Pvt Ltd",
    seller_address: "123, Elphinstone Road, Mumbai, Maharashtra, 400012",
    seller_pan: "KSLMK1234P",
    seller_gst: "12ABCDE1234F1Z5",
    place_of_supply: "Maharashtra",
    signature: "/assets/signature.png",
  });

  function str_Random(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    // Loop to generate characters for the specified length
    for (let i = 0; i < length; i++) {
      const randomInd = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomInd);
    }
    return result;
  }

  const onDropLogo = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setSupplier({
          ...supplier,
          company_logo: reader.result,
        });
      };
      reader.readAsDataURL(file);
    },
    [supplier]
  );

  const onDropSignature = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setSupplier({
          ...supplier,
          signature: reader.result,
        });
      };
      reader.readAsDataURL(file);
    },
    [supplier]
  );

  const { getRootProps: getLogoRootProps, getInputProps: getLogoInputProps } =
    useDropzone({ onDrop: onDropLogo, accept: "image/*" });
  const {
    getRootProps: getSignatureRootProps,
    getInputProps: getSignatureInputProps,
  } = useDropzone({ onDrop: onDropSignature, accept: "image/*" });

  const handleCheckboxChange = (product) => {
    setCheckedProducts((prevState) => ({
      ...prevState,
      [product.name]: prevState[product.name] ? !prevState[product.name] : true,
    }));
  };

  const handleQuantityChange = (productName, quantity) => {
    setQuantities((prevState) => ({
      ...prevState,
      [productName]: Number(quantity),
    }));
  };

  const selectedProducts = products.filter(
    (product) => checkedProducts[product.name]
  );

  const handleDiscountChange = (productName, discount) => {
    const updatedProducts = products.map((prod) => {
      if (prod.name === productName) {
        return { ...prod, discount: Number(discount) };
      }
      return prod;
    });
    setProducts(updatedProducts);
  };

  const calculateTotal = () => {
    let total = 0;
    selectedProducts.forEach((product) => {
      const quantity = quantities[product.name] || 1;
      const discountedPrice =
        product.unitPrice *
        (1 - (product.discount ? product.discount : 0) / 100);
      total += discountedPrice * quantity;
    });
    return total.toFixed(2);
  };

  const calculateGST = (total) => {
    if (sameState) {
      const cgst = total * 0.09;
      const sgst = total * 0.09;
      return {
        cgst: cgst.toFixed(2),
        sgst: sgst.toFixed(2),
        totalWithoutGST: total,
        totalWithGST: (total + cgst + sgst).toFixed(2),
        totalGST: (cgst + sgst).toFixed(2),
      };
    } else {
      const igst = total * 0.18;
      return {
        igst: igst.toFixed(2),
        totalWithoutGST: total,
        totalWithGST: (total + igst).toFixed(2),
        totalGST: igst.toFixed(2),
      };
    }
  };

  const total = parseFloat(calculateTotal());
  const gstValues = calculateGST(total);

  console.log(invoiceInfo);

  const handleInvoice = () => {
    console.log("click");

    const formData = {
      supplier,
      selectedProducts,
      customerBill,
      customerShip,
      quantities,
      invoiceInfo,
      gstValues,
    };

    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/invoice/${invoiceInfo.invoice_no}`, { state: { formData } });
  };

  useEffect(() => {
    if (supplier.place_of_supply === customerShip.place_to_deliver) {
      setSameState(true);
    } else {
      setSameState(false);
    }
  }, [customerShip.place_to_deliver, supplier.place_of_supply]);

  return (
    <main className="max-w-[89rem] mx-auto">
      <h1 className="text-[3.2rem] text-center font-bold mt-5">
        Invoice Generator
      </h1>

      <div className="flex justify-center gap-10 mt-10 text-center mb-5">
        {/* LOGO IMAGE DROPPER */}
        <div>
          <div
            {...getLogoRootProps({ className: "dropzone" })}
            className="p-2.5 mb-2.5 text-center min-h-full"
            style={{
              border: "2px dashed #cccccc",
            }}
          >
            <input {...getLogoInputProps()} />
            <p>
              Drag & drop a new company logo here, or click to select a file
            </p>
            {supplier.company_logo && (
              <img
                src={supplier.company_logo}
                alt="Company Logo"
                className="w-[300px] mx-auto select-none"
                draggable={false}
              />
            )}
          </div>
        </div>

        {/* SIGNATURE IMAGE DROPPER */}
        <div>
          <div
            {...getSignatureRootProps({ className: "dropzone" })}
            className="p-2.5 mb-2.5 text-center min-h-full"
            style={{
              border: "2px dashed #cccccc",
            }}
          >
            <input {...getSignatureInputProps()} />
            <p>Drag & drop a new seller signature, or click to select a file</p>
            {supplier.signature && (
              <img
                src={supplier.signature}
                alt="Company Logo"
                className="w-[300px] mx-auto select-none"
                draggable={false}
              />
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          {/* SUPPLIER INFO */}
          <h1 className="text-[2rem] font-medium">Supplier Info</h1>
          <div className="flex items-center gap-5 text-[1.3rem]">
            <h1>
              <span className="font-medium">Invoice Date:</span>{" "}
              {invoiceInfo.invoice_date}
            </h1>
            <h1>
              <span className="font-medium">Invoice No:</span>{" "}
              {invoiceInfo.invoice_no}
            </h1>
            <h1>
              <span className="font-medium">Order No:</span>{" "}
              {invoiceInfo.order_no}
            </h1>
          </div>
        </div>
        <div className="mt-3 mb-7 flex justify-between">
          <div>
            <h1 className="text-[1.3rem] font-medium">Supplier Name</h1>
            <input
              type="text"
              className="text-[1.1rem] border-black border rounded-md px-2 py-1 mt-2 shadow-xl"
              defaultValue={supplier.seller_name}
              onChange={(e) =>
                setSupplier((prevState) => ({
                  ...prevState,
                  seller_name: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <h1 className="text-[1.3rem] font-medium">Supplier Address</h1>
            <input
              type="text"
              className="text-[1.1rem] border-black border rounded-md px-2 py-1 mt-2 shadow-xl"
              defaultValue={supplier.seller_address}
              onChange={(e) =>
                setSupplier((prevState) => ({
                  ...prevState,
                  seller_address: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <h1 className="text-[1.3rem] font-medium">Supplier PAN</h1>
            <input
              type="text"
              className="text-[1.1rem] border-black border rounded-md px-2 py-1 mt-2 shadow-xl"
              defaultValue={supplier.seller_pan}
              onChange={(e) =>
                setSupplier((prevState) => ({
                  ...prevState,
                  seller_pan: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <h1 className="text-[1.3rem] font-medium">
              Supplier GST Registration No.
            </h1>
            <input
              type="text"
              className="text-[1.1rem] border-black border rounded-md px-2 py-1 mt-2 shadow-xl"
              defaultValue={supplier.seller_gst}
              onChange={(e) =>
                setSupplier((prevState) => ({
                  ...prevState,
                  seller_gst: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <h1 className="text-[1.3rem] font-medium">Supplied From</h1>
            <input
              type="text"
              className="text-[1.1rem] border-black border rounded-md px-2 py-1 mt-2 shadow-xl"
              defaultValue={supplier.place_of_supply}
              onChange={(e) =>
                setSupplier((prevState) => ({
                  ...prevState,
                  place_of_supply: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </div>

      <div className="mt-10">
        {/* CUSTOMER INFO (BILLING) */}
        <h1 className="text-[2rem] font-medium">Customer Info ( Billing )</h1>
        <div className="mt-3 mb-7 flex gap-24">
          <div>
            <h1 className="text-[1.3rem] font-medium">Customer Name</h1>
            {/* <h1 className="text-[1.1rem]">{supplier.seller_name}</h1> */}
            <input
              type="text"
              className="text-[1.1rem] border-black border rounded-md px-2 py-1 mt-2 shadow-xl"
              defaultValue={customerBill.bill_name}
              onChange={(e) =>
                setCustomerBill((prevState) => ({
                  ...prevState,
                  bill_name: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <h1 className="text-[1.3rem] font-medium">Customer Address</h1>
            {/* <h1 className="text-[1.1rem]">{supplier.seller_address}</h1> */}
            <input
              type="text"
              className="text-[1.1rem] border-black border rounded-md px-2 py-1 mt-2 shadow-xl"
              defaultValue={customerBill.bill_address}
              onChange={(e) =>
                setCustomerBill((prevState) => ({
                  ...prevState,
                  bill_address: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <h1 className="text-[1.3rem] font-medium">Customer State Code</h1>
            {/* <h1 className="text-[1.1rem]">{supplier.seller_pan}</h1> */}
            <input
              type="number"
              className="text-[1.1rem] border-black border rounded-md px-2 py-1 mt-2 shadow-xl"
              defaultValue={customerBill.bill_state_id}
              onChange={(e) => {
                setCustomerBill((prevState) => ({
                  ...prevState,
                  bill_state_id: e.target.value,
                }));
              }}
              min={0}
            />
          </div>
        </div>
      </div>

      <div className="mt-10">
        {/* CUSTOMER INFO (SHIPPING) */}
        <h1 className="text-[2rem] font-medium">Customer Info ( Shipping )</h1>
        <div className="mt-3 mb-7 flex justify-between">
          <div>
            <h1 className="text-[1.3rem] font-medium">Customer Name</h1>
            <input
              type="text"
              className="text-[1.1rem] border-black border rounded-md px-2 py-1 mt-2 shadow-xl"
              defaultValue={customerShip.ship_name}
              onChange={(e) =>
                setCustomerShip((prevState) => ({
                  ...prevState,
                  ship_name: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <h1 className="text-[1.3rem] font-medium">Customer Address</h1>
            <input
              type="text"
              className="text-[1.1rem] border-black border rounded-md px-2 py-1 mt-2 shadow-xl"
              defaultValue={customerShip.ship_address}
              onChange={(e) =>
                setCustomerShip((prevState) => ({
                  ...prevState,
                  ship_address: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <h1 className="text-[1.3rem] font-medium">Customer State Code</h1>
            <input
              type="number"
              className="text-[1.1rem] border-black border rounded-md px-2 py-1 mt-2 shadow-xl"
              defaultValue={customerShip.ship_state_id}
              onChange={(e) =>
                setCustomerShip((prevState) => ({
                  ...prevState,
                  ship_state_id: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <h1 className="text-[1.3rem] font-medium">Place to deliver</h1>
            <input
              type="text"
              className="text-[1.1rem] border-black border rounded-md px-2 py-1 mt-2 shadow-xl"
              defaultValue={customerShip.place_to_deliver}
              onChange={(e) =>
                setCustomerShip((prevState) => ({
                  ...prevState,
                  place_to_deliver: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <h1 className="text-[1.3rem] font-medium">Order Date</h1>
            <input
              type="date"
              className="text-[1.1rem] border-black border rounded-md px-2 py-1 mt-2 shadow-xl"
              defaultValue={customerShip.order_date}
              onChange={(e) => {
                setCustomerShip((prevState) => ({
                  ...prevState,
                  order_date: e.target.value,
                }));
                console.log(customerShip);
              }}
            />
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="flex gap-16">
        <div>
          <h1 className="text-[2rem] font-medium mb-5 mt-5">Products</h1>
          <div>
            {products.map((product, index) => (
              <div
                key={index}
                className="flex gap-10 bg-slate-400 p-5 rounded-2xl mb-5 items-center px-10 shadow-2xl"
              >
                <div>
                  <input
                    type="checkbox"
                    className="scale-[1.75] cursor-pointer"
                    checked={checkedProducts[product.name] || false}
                    onChange={() => handleCheckboxChange(product)}
                  />
                </div>
                <div className="flex gap-10 flex-1">
                  <img
                    src={product.image}
                    alt="echo"
                    className="rounded-2xl w-[10rem] h-full select-none"
                    draggable={false}
                  />
                  <div>
                    <div className="mb-5">
                      <h1 className="text-[2rem] font-bold">{product.name}</h1>
                      <h1 className="text-[1.3rem]">
                        <span className="font-bold">Price: </span>₹{" "}
                        {product.unitPrice}
                      </h1>
                    </div>
                    <h1 className="font-bold text-[1.3rem]">Description</h1>
                    <p className="text-[1.3rem]">{product.description}</p>
                  </div>
                </div>

                <div>
                  <div>
                    <h1 className="mb-1">Qty:</h1>
                    <select
                      value={quantities[product.name] || 1}
                      onChange={(e) =>
                        handleQuantityChange(product.name, e.target.value)
                      }
                      disabled={checkedProducts[product.name]}
                      className="disabled:opacity-50 rounded-md text-[1.2rem]"
                    >
                      {[...Array(10).keys()].map((n) => (
                        <option key={n + 1} value={n + 1}>
                          {n + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <h1 className="mt-5 mb-1">Discount:</h1>
                    <input
                      type="number"
                      placeholder="Discount %"
                      min={0}
                      max={100}
                      value={product.discount ? product.discount : 0}
                      onChange={(e) =>
                        handleDiscountChange(product.name, e.target.value)
                      }
                      className="w-[65px] rounded-md text-[1.2rem] px-2"
                      disabled={checkedProducts[product.name]}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SELECTED PRODUCTS */}
        <div className="flex-1 mt-5">
          <h1 className="text-[2rem] font-medium mb-5">Invoice for</h1>
          {selectedProducts.length > 0 ? (
            <>
              <ul>
                {selectedProducts.map((checkedProduct) => (
                  <li
                    key={checkedProduct.name}
                    className="flex justify-between p-5 bg-red-500 mb-5 rounded-xl text-white"
                  >
                    <div>
                      <h1 className="text-[18px] font-bold">
                        {checkedProduct.name}
                      </h1>
                      <h1 className="text-[18px] font-medium">
                        ₹ {checkedProduct.unitPrice}
                      </h1>
                    </div>
                    <h1>
                      Qty:{" "}
                      {quantities[checkedProduct.name]
                        ? quantities[checkedProduct.name]
                        : 1}
                    </h1>
                  </li>
                ))}
              </ul>

              <hr className="border-black mt-10 mb-5" />
              <div className="mb-5">
                {sameState ? (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <h1 className="text-[1.2rem] font-medium">SGST (9%):</h1>
                      <h1 className="text-[1.2rem] font-medium">
                        ₹ {gstValues.sgst}
                      </h1>
                    </div>
                    <div className="flex items-center justify-between">
                      <h1 className="text-[1.2rem] font-medium">CGST (9%):</h1>
                      <h1 className="text-[1.2rem] font-medium">
                        ₹ {gstValues.cgst}
                      </h1>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-[1.2rem] font-medium">IGST (18%):</h1>
                    <h1 className="text-[1.2rem] font-medium">
                      ₹ {gstValues.igst}
                    </h1>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <h1 className="text-[1.5rem] font-medium">Total</h1>
                  <h1 className="text-[1.2rem] font-medium">
                    ₹ {gstValues.totalWithGST}
                  </h1>
                </div>
              </div>

              <button
                onClick={handleInvoice}
                className="bg-blue-600 hover:bg-blue-800 focus-visible:::bg-blue-800 w-full py-5 text-[20px] font-bold text-white rounded-2xl disabled:opacity-75 cursor-pointer"
                disabled={checkedProducts.length === 0}
              >
                Create Invoice
              </button>
            </>
          ) : (
            <h1 className="text-[1.1rem]">No products selected.</h1>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
