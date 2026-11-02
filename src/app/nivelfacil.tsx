import { StyleSheet, View } from 'react-native';
import SudokuTabuleiroComponente from '@/components/SudokuTabuleiroComponente';

export default function NivelFacilScreen() {
    return (
        <View style={styles.container}>
            <SudokuTabuleiroComponente nivel="Fácil" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
