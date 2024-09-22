import {
  Font,
  Page,
  StyleSheet,
  View,
  Text,
  Document,
} from "@react-pdf/renderer";
import React, { useEffect, useState } from "react";
import GiloryRegular from "../assets/fonts/Gilroy-Regular.ttf";
import GiloryBold from "../assets/fonts/Gilroy-Bold.ttf";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./Loading";
import { da } from "date-fns/locale";
import { formatMoney } from "./Constants";

Font.register({
  family: "Gilroy", // Use any font available in your environment or download one
  fonts: [
    { src: GiloryRegular }, // Normal
    {
      src: GiloryBold,
      fontWeight: "bold",
    },
  ],
});
Font.getHyphenationCallback((word) => [word]);
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  top: {
    display: "flex",
    alignContent: "center",
  },
  title: {
    fontSize: 24,
    textAlign: "left",
    alignSelf: "flex-start",
    color: "#2fa9ea",
  },
  invdetails: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  customerdet: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  desc: {
    color: "#2fa9ea",
    fontSize: 12,
  },
  loc: {
    fontSize: 12,
  },
  det: {
    color: "black",
  },
  aleft: {
    display: "flex",
    justifyContent: "flex-start",
  },
  maindet: {
    fontSize: 12,
  },
  table: {
    display: "table",
    width: "auto",
    // borderStyle: "solid",
    // borderColor: "#000000",
    // borderWidth: 1,
    flexDirection: "column",
    marginTop: 30,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  tableCellHeader: {
    padding: 5,
    color: "#2fa9ea",
    textAlign: "center",
    fontWeight: "bold",
    borderRight: 1,
    borderTop: 1,
    borderBottom: 1,
    fontSize: 12,
    fontWeight: "bold",
    flex: 1,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  tableCell: {
    padding: 5,
    textAlign: "center",
    fontSize: 12,
    flex: 1,
    borderRight: 1,
    borderBottom: 1,
    borderColor: "#000000",
  },
  totalCell: {
    padding: 5,
    textAlign: "center",
    fontSize: 12,
    flex: 1,
    borderRight: 1,
    borderColor: "#000000",
  },
  tableCellX: {
    padding: 5,
    flex: 1,
  },
  footer: {
    textAlign: "left",
    marginTop: 20,
    fontSize: 12,
    position: "absolute",
    bottom: 65,
    right: 35,
    left: 35,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 35,
    left: 0,
    right: 0,
    color: "grey",
    textAlign: "center",
  },
});

function InvoicePDF({ data, receipient }) {
  const [config, setConfig] = useState({});

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    await fetch("/config.json")
      .then((response) => response.json())
      .then((data) => setConfig(data))
      .catch((error) => {
        toast.error(`Cannot load shop details => ${error.message}`);
        console.log(error);
      });
  };

  if (!config)
    return (
      <div className="wait">
        <Loading />
      </div>
    );

  // const date = new Date();
  // const currentDate = `${String(date.getDate()).padStart(2, "0")}/${String(
  //   date.getMonth() + 1
  // ).padStart(2, "0")}/${date.getFullYear()}`;

  const total = () => {
    const totalPrice = data.reduce((acc, item) => {
      return acc + item.total;
    }, 0);
    return totalPrice;
  };

  return (
    <Document>
      <Page size="A4" style={styles.body} wrap="true">
        <View style={styles.top}>
          <Text style={styles.title}>{config.shopName}</Text>
          <Text style={styles.loc}>{config.type}</Text>
        </View>
        <View style={styles.invdetails}>
          <View>
            <Text style={styles.loc}>{config.location}</Text>
            <Text style={styles.loc}>{config.address1}</Text>
            <Text style={styles.loc}>{config.address2}</Text>
          </View>
          <View>
            <Text style={{ ...styles.desc, ...styles.aleft }}>INVOICE</Text>
          </View>
        </View>
        <View style={styles.customerdet}>
          <View>
            <Text style={styles.desc}>
              To:{" "}
              <Text style={{ ...styles.det, ...styles.maindet }}>
                {receipient.name}
              </Text>
            </Text>
          </View>
          <View>
            <Text style={styles.desc}>
              #No: <Text style={styles.det}>{receipient.id}</Text>
            </Text>
            <Text style={styles.desc}>
              Date:{" "}
              <Text style={styles.det}>
                {receipient.date_of}
                {/* asdkk hello daddy. Daddy good evening nyame nadom me ho y3 paa na wonso e33 */}
              </Text>
            </Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View
              style={{ ...styles.tableCellHeader, flex: 0.05, borderLeft: 1 }}
            >
              <Text>No</Text>
            </View>
            <View style={{ ...styles.tableCellHeader, flex: 0.4 }}>
              <Text>Product Name/Desc</Text>
            </View>
            <View style={{ ...styles.tableCellHeader, flex: 0.1 }}>
              <Text>Qnt</Text>
            </View>
            <View style={{ ...styles.tableCellHeader, flex: 0.2 }}>
              <Text>Price</Text>
            </View>
            <View style={{ ...styles.tableCellHeader, flex: 0.25 }}>
              <Text>Sub-Total</Text>
            </View>
          </View>
          {data.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={{ ...styles.tableCell, flex: 0.05, borderLeft: 1 }}>
                <Text>{index + 1}</Text>
              </View>
              <View style={{ ...styles.tableCell, flex: 0.4 }}>
                <Text>{item.name}</Text>
              </View>
              <View style={{ ...styles.tableCell, flex: 0.1 }}>
                <Text>{item.qnt}</Text>
              </View>
              <View style={{ ...styles.tableCell, flex: 0.2 }}>
                <Text>{formatMoney(item.selling_price)}</Text>
              </View>
              <View style={{ ...styles.tableCell, flex: 0.25 }}>
                <Text>{`${formatMoney(item.subtotal)}`}</Text>
              </View>
            </View>
          ))}
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCellX, flex: 0.05 }}></View>
            <View style={{ ...styles.tableCellX, flex: 0.4 }}></View>
            <View style={{ ...styles.tableCellX, flex: 0.1 }}></View>
            <View style={{ ...styles.tableCell, flex: 0.2, borderLeft: 1 }}>
              <Text style={styles.desc}>Total</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 0.25 }}>
              <Text>
                {" "}
                {`${config.currency} ${formatMoney(receipient.total)}`}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <Text>For more enquiries, please contact: {config.phoneNumber}</Text>
          <Text>{config.message}</Text>
        </View>
        <Text
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          style={styles.pageNumber}
          fixed
        />
      </Page>
    </Document>
  );
}

export default InvoicePDF;
