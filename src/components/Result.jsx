import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function Result(props) {
  const { capital, total, interes, meses, errorMessage } = props;
  return (
    <View style={styles.containerMessages}>
      {total && (
        <View>
          <Text style={[styles.success, styles.title]}>Datos:</Text>
          <View style={styles.table}>
            <TableRow label="Capital:" value={`$${capital}`} />
            <TableRow label="Interes:" value={`$${interes}`} />
            <TableRow label="Plazo:" value={`${meses} meses`} />
            <TableRow label="Pago mensual:" value={`$${total.monthlyFee}`} />
            <TableRow label="Total a pagar:" value={`$${total.totalPayable}`} />
          </View>
        </View>
      )}

      <View>
        <Text style={styles.error}>{errorMessage}</Text>
      </View>
    </View>
  );
}

function TableRow(props) {
  const { label, value } = props;
  return (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{label}</Text>
      <Text style={styles.tableCell}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    textAlign: "center",
    color: "red",
    fontWeight: "bold",
    fontSize: 20,
    fontSize: 16,
  },
  success: {
    textAlign: "center",
    color: "blue",
    fontSize: 20,
    fontSize: 16,
  },
  containerMessages: {
    margin: 16,
    borderColor: "red",
  },
  title: {
    fontSize: 25,
    color: "black",
    fontWeight: "bold",
    textAlign: "start",
  },
  table: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  tableCell: {
    fontSize: 16,
  },
});
