import styles from "./styles.module.scss"

export default function InputField({ fieldName, fieldType, onChange, fieldValue }) {
    return (
        <div className={styles.container}>
            <label>{fieldName}</label>
            <input type={fieldType} onChange={onChange} value={fieldValue} required />
        </div>
    )
}