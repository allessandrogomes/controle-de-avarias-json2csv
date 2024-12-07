import styles from "./styles.module.scss"
import { FaWindowClose } from "react-icons/fa"

export default function BreakdownBox({ id, code, desc, qtd, onCloseModal }) {
    return (
        <div className={styles.container} key={id}>
            <p>{code} | {desc} | {qtd}</p>
            <FaWindowClose onClick={onCloseModal} className={styles.closeButton} />
        </div>
    )
}