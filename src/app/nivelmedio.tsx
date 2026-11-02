import { StyleSheet, View } from 'react-native';
import SudokuTabuleiroComponente from '@/components/SudokuTabuleiroComponente';

export default function NivelMedioScreen() {
    return (
        <View style={styles.container}>
            <SudokuTabuleiroComponente nivel="Médio" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
