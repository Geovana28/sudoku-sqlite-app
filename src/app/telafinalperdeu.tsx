import { StyleSheet, View } from 'react-native';
import TelaPerdeuComponente from '@/components/TelaPerdeuComponente';

export default function TelaFinalPerdeuScreen() {
    return (
        <View style={styles.container}>
            <TelaPerdeuComponente />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
