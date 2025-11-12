import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function Container({ children, style, scrollable = true }) {
if (scrollable) {
    return (
    <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.container, style]}
        showsVerticalScrollIndicator={false}
    >
        {children}
    </ScrollView>
    );
}

// kalau scrollable = false, ganti ScrollView jadi View biasa
return <View style={[styles.scroll, styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
scroll: {
    flex: 1,
    backgroundColor: "#EFECFE",
},
container: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 32,
    paddingTop: 10,
},
});
