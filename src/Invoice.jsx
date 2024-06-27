/* eslint-disable no-undef */
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation, useNavigate } from "react-router-dom";
import { ToWords } from "to-words";

const Invoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state.formData;

  const supplier = data.supplier;
  const selectedProducts = data.selectedProducts;
  const customerBill = data.customerBill;
  const customerShip = data.customerShip;
  const quantities = data.quantities;
  const gstValues = data.gstValues;
  const invoiceInfo = data.invoiceInfo;

  const toWords = new ToWords();

  const generatePDF = () => {
    console.log("pdf");
    const input = document.getElementById("invoice");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save(`invoice#${invoiceInfo.invoice_no}.pdf`);
    });
  };

  const goBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/");
  };

  const calculateNetAmount = (unitPrice, quantity, discount) => {
    return unitPrice * quantity - discount;
  };

  // console.log(supplier);
  // console.log(selectedProducts);
  // console.log(customerBill);
  // console.log(customerShip);
  // console.log(quantities);
  // console.log(gstValues);
  // console.log(invoiceInfo);

  return (
    <div>
      <div className="text-center mt-5 flex justify-center gap-10">
        <button
          onClick={goBack}
          className="p-5 rounded-xl bg-blue-500 hover:bg-blue-700 focus-visible:bg-blue-700 font-medium text-white text-[1.2rem] w-[200px]"
        >
          Go Back
        </button>
        <button
          onClick={generatePDF}
          className="p-5 rounded-xl bg-red-500 hover:bg-red-700 focus-visible:bg-red-700 font-medium text-white text-[1.2rem] w-[200px]"
        >
          Generate PDF
        </button>
      </div>
      <div
        id="invoice"
        className="p-5 my-10 w-[210mm] min-h-[297mm] mx-auto border border-black"
        style={{
          fontFamily: "Arial",
        }}
      >
        <div className="mb-5 flex justify-between items-center text-right">
          <img
            src={supplier.company_logo}
            alt="Logo"
            className="w-[200px] select-none"
            draggable={false}
          />
          <div>
            <h1 className="text-[1.3rem] font-bold mb-2">Invoice</h1>
            <p>
              <strong>Invoice No:</strong> {invoiceInfo.invoice_no}
            </p>
            <p>
              <strong>Invoice Date:</strong> {invoiceInfo.invoice_date}
            </p>
          </div>
        </div>
        <div className="flex justify-between mb-5">
          <div className="w-[400px]">
            <h2 className="text-[1.3rem] font-bold mb-2">Seller Details</h2>
            <p>
              <strong>Name:</strong> {supplier.seller_name}
            </p>
            <p>
              <strong>Address:</strong> {supplier.seller_address}
            </p>
            <p>
              <strong>PAN No:</strong> {supplier.seller_pan}
            </p>
            <p>
              <strong>GST Registration No:</strong> {supplier.seller_gst}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-[1.3rem] font-bold mb-2">Billing Details</h2>
            <p>
              <strong>Name:</strong> {customerBill.bill_name}
            </p>
            <p>
              <strong>Address:</strong> {customerBill.bill_address}
            </p>
            <p>
              <strong>State/UT Code:</strong> {customerBill.bill_state_id}
            </p>
          </div>
        </div>
        <div className="flex justify-between mb-5">
          <div className="w-[400px]">
            <h2 className="text-[1.3rem] font-bold mb-2">Shipping Details</h2>
            <p>
              <strong>Name:</strong> {customerShip.ship_name}
            </p>
            <p>
              <strong>Address:</strong> {customerShip.ship_address}
            </p>
            <p>
              <strong>State/UT Code:</strong> {customerShip.ship_state_id}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-[1.3rem] font-bold mb-2">Order Details</h2>
            <p>
              <strong>Order No:</strong> {invoiceInfo.order_no}
            </p>
            <p>
              <strong>Order Date:</strong> {customerShip.order_date}
            </p>
          </div>
        </div>
        <div className="mb-5 mt-10">
          <table className="max-w-full">
            <thead>
              <tr>
                <th className="border border-black p-2">Description</th>
                <th className="border border-black p-2">Unit Price</th>
                <th className="border border-black p-2">Quantity</th>
                {/* <th className="border border-black p-2">Discount</th> */}
                <th className="border border-black p-2">Net Amount</th>
                <th className="border border-black p-2">Tax Rate</th>
                <th className="border border-black p-2">Tax Amount</th>
                <th className="border border-black p-2">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((product, index) => {
                const netAmount = calculateNetAmount(
                  product.unitPrice,
                  quantities[product.name] || 1,
                  product.discount || 0
                );
                const taxAmount = netAmount * 0.18;

                return (
                  <tr key={index}>
                    <td className="border border-black p-3">
                      <strong>
                        {product.name}
                        <br />
                      </strong>
                      {product.description}
                    </td>
                    <td className="border border-black p-3 text-center">
                      ₹{product.unitPrice}
                    </td>
                    <td className="border border-black p-3 text-center">
                      {quantities[product.name] || 1}
                    </td>
                    {/* <td className="border border-black p-3">
                      {product.discount || 0}%
                    </td> */}
                    <td className="border border-black p-3 text-center">
                      ₹{netAmount}
                    </td>
                    {supplier.place_of_supply ===
                    customerShip.place_to_deliver ? (
                      <>
                        <td className="border border-black text-center">
                          <div className="border-b-2">
                            CGST: 9% <hr className="border-black" />
                            SGST: 9%
                          </div>
                        </td>
                        <td className="border border-black text-center">
                          <div>
                            CGST: ₹{taxAmount / 2}{" "}
                            <hr className="border-black" />
                            SGST: ₹{taxAmount / 2}
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="border border-black p-5 text-center">
                          <div>IGST: 18%</div>
                        </td>
                        <td className="border border-black p-5 text-center">
                          <div>IGST: ₹{taxAmount}</div>
                        </td>
                      </>
                    )}

                    <td className="border border-black p-5 text-center">
                      ₹{gstValues.totalWithGST}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mb-5">
          <h2 className="text-[1.3rem] font-bold mb-2">Summary</h2>
          <div className="flex flex-col gap-5">
            <div className="flex justify-between">
              <p>
                <strong>Total Net Amount:</strong> ₹{gstValues.totalWithoutGST}
              </p>
              <p>
                <strong>Total Tax Amount:</strong> ₹{gstValues.totalGST}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{gstValues.totalWithGST}
              </p>
            </div>
            <p>
              <strong>Amount in Words:</strong>{" "}
              {toWords.convert(gstValues.totalWithGST, { currency: true })}
            </p>
          </div>
        </div>
        <div className="text-right mt-5">
          <p>For {supplier.seller_name}:</p>
          <img
            src={supplier.signature}
            alt="Signature"
            className="w-[150px] ml-auto select-none"
            draggable={false}
          />
          <p>Authorised Signatory</p>
        </div>
      </div>
    </div>
  );

  // return <div>{supplier.seller_name}</div>;
};

export default Invoice;
