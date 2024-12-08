import styles from "./styles.module.scss"

const disabledStyle = {
    backgroundColor: "gray",
    cursor: "default"
}

export default function DefaultButton({ bgColor, disabled, onClick, text, icon }) {
    return (
        <button
            style={disabled ? disabledStyle : {backgroundColor: `${bgColor}`}}
            className={styles.button}
            disabled={disabled}
            onClick={onClick}>
            {text} {icon}
        </button>
    )
}