import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { useLocation } from "react-router-dom";
import { decryptJsonValue } from "./Constants";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import downloadIcn from "../assets/icons/download.svg";

function InvoicePDFViewer() {
  const [invData, setInvData] = useState([]);
  const [rec, setRec] = useState({});

  useEffect(() => {
    const encryptedData = localStorage.getItem("invData");
    const encryptedR = localStorage.getItem("rec");

    if (encryptedData && encryptedR) {
      const decryptedData = decryptJsonValue(encryptedData);
      const decryptedR = decryptJsonValue(encryptedR);

      setRec(decryptedR);
      setInvData(decryptedData);
    }
  }, []);

  // const itemGroup = JSON.parse(localStorage.getItem("invoiceData"));
  // const invid = JSON.parse(localStorage.getItem("invID"));

  return (
    <div className="w-full h-full bg-gray-600">
      <div className="flex justify-end items-center">
        <PDFDownloadLink
          document={<InvoicePDF data={invData} receipient={rec} />}
          fileName={`${rec.name}_${rec.date_time}`}
        >
          {({ blob, url, loading, error }) =>
            loading ? (
              <button
                disabled={loading}
                className="flex justify-center items-center gap-1 mr-10 mb-2 mt-2 w-[100px] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <p>Generating</p>
                <Loading />
              </button>
            ) : (
              <button className="flex justify-center items-center flex-col mr-10 text-gray-400 hover:bg-gray-200 hover:text-gray-600 w-[100px] rounded-md border border-gray-200 mb-2 mt-2">
                <img
                  className="w-[30px] h-[30px]"
                  src={downloadIcn}
                  alt="download"
                />
                <p className="font-medium">Download</p>
              </button>
            )
          }
        </PDFDownloadLink>
      </div>
      <PDFViewer showToolbar={false} width="100%" height="100%" scale={1.0}>
        <InvoicePDF data={invData} receipient={rec} />
      </PDFViewer>
    </div>
  );
}
export default InvoicePDFViewer;
