import React, { FC, useEffect, useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import "./CreditCardInput.scss";

export interface CreditCardData {
  name: string;
  number: string;
  expiry: string;
  cvc?: string;
  type?: string;
}

interface CreditCardInputProps {
  id?: string;
  label?: string;
  value?: CreditCardData;
  onChange?: (data: CreditCardData) => void;
  disabled?: boolean;
  showCVC?: boolean;
}

/** ✅ Detects card type from number */
const detectCardType = (number: string): string | undefined => {
  const cleaned = number.replace(/\D/g, "");

  if (/^3[47][0-9]{0,13}$/.test(cleaned)) return "American Express";
  if (/^3(?:0[0-5]|[68][0-9])[0-9]{0,11}$/.test(cleaned)) return "Diners Club";
  if (/^6(?:011|5[0-9]{2})[0-9]{0,12}$/.test(cleaned)) return "Discover";
  if (/^63[7-9][0-9]{0,13}$/.test(cleaned)) return "InstaPayment";
  if (/^(?:2131|1800|35\d{0,3})\d{0,11}$/.test(cleaned)) return "JCB";
  if (/^(6304|6706|6709|6771)[0-9]{0,15}$/.test(cleaned)) return "Laser";
  if (
    /^(5018|5020|5038|6304|6759|676[1-3]|0604|6390)[0-9]{0,15}$/.test(cleaned)
  )
    return "Maestro";
  if (
    /^(5[1-5][0-9]{0,14}|2(2[2-9][0-9]{0,12}|[3-6][0-9]{0,13}|7[01][0-9]{0,12}|720[0-9]{0,12}))$/.test(
      cleaned
    )
  )
    return "MasterCard";
  if (/^4[0-9]{0,15}$/.test(cleaned)) return "Visa";

  return undefined;
};

/** ✅ Formats expiry as MM/YY (smooth typing + backspace through slash) */
const formatExpiry = (input: string, prev: string): string => {
  const digits = input.replace(/\D/g, "");
  const prevDigits = prev.replace(/\D/g, "");
  const isDeleting = digits.length < prevDigits.length;

  // Allow clear
  if (!digits) return "";

  // --- Handle deletion ---
  if (isDeleting) {
    // Remove slash cleanly (e.g. "03/" → "03")
    if (prev.endsWith("/") && digits.length === 2) return digits;
    // Deleting month or year
    if (digits.length <= 2) return digits;
    if (digits.length <= 4)
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
  }

  // --- Handle typing ---
  // Single-digit month
  if (digits.length === 1) {
    const first = parseInt(digits, 10);
    if (first > 1 && first <= 9) return `0${first}/`;
    return digits;
  }

  // Two digits (month)
  if (digits.length === 2) {
    let month = parseInt(digits, 10);
    if (month === 0) return "";
    if (month > 12) month = 12;
    return `${month.toString().padStart(2, "0")}/`;
  }

  // Full MMYY
  const month = digits.substring(0, 2);
  const year = digits.substring(2, 4);
  return `${month}/${year}`;
};

const CreditCardInput: FC<CreditCardInputProps> = ({
  id,
  label = "Credit Card Information",
  value,
  onChange,
  disabled = false,
  showCVC = true,
}) => {
  const [focus, setFocus] = useState<keyof CreditCardData | undefined>();
  const [cardData, setCardData] = useState<CreditCardData>({
    name: value?.name || "",
    number: value?.number || "",
    expiry: value?.expiry || "",
    cvc: value?.cvc || "",
    type: value?.type || "",
  });

  // Keep external value synced
  useEffect(() => {
    if (value) {
      const detected = detectCardType(value.number || "");
      setCardData({
        ...value,
        type: detected || value.type || "",
      });
    }
  }, [value]);

  const handleChange = (field: keyof CreditCardData, val: string) => {
    let updated = { ...cardData, [field]: val };

    if (field === "number") updated.type = detectCardType(val) || "";
    if (field === "expiry") updated.expiry = formatExpiry(val, cardData.expiry);

    setCardData(updated);
    onChange?.(updated);
  };

  return (
    <div className="credit-card-input-wrapper" id={id}>
      {label && <h5 className="credit-card-label">{label}</h5>}

      <div className="credit-card-fields">
        {/* Name */}
        <div className="input-group">
          <label>Name on Credit Card</label>
          <input
            type="text"
            value={cardData.name}
            onFocus={() => setFocus("name")}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Name on Credit Card"
            disabled={disabled}
          />
        </div>

        {/* Card Number */}
        <div className="input-group">
          <label>Credit Card Number</label>
          <input
            type="tel"
            value={cardData.number}
            onFocus={() => setFocus("number")}
            onChange={(e) => handleChange("number", e.target.value)}
            placeholder="**** **** **** ****"
            maxLength={19}
            disabled={disabled}
          />
        </div>

        {/* Expiry + CVC */}
        <div className="input-row">
          <div className="input-group">
            <label>Expiration Date (MM/YY)</label>
            <input
              type="text"
              value={cardData.expiry}
              onFocus={() => setFocus("expiry")}
              onChange={(e) => handleChange("expiry", e.target.value)}
              placeholder="MM/YY"
              maxLength={5}
              disabled={disabled}
            />
          </div>

          {showCVC && (
            <div className="input-group">
              <label>CVC</label>
              <input
                type="text"
                value={cardData.cvc}
                onFocus={() => setFocus("cvc")}
                onChange={(e) => handleChange("cvc", e.target.value)}
                placeholder="***"
                maxLength={4}
                disabled={disabled}
              />
            </div>
          )}
        </div>

        {/* Card Type */}
        <div className="input-group">
          <label>Card Type</label>
          <input type="text" value={cardData.type || "Unknown"} disabled />
        </div>

        <Cards
          number={cardData.number}
          name={cardData.name}
          expiry={cardData.expiry}
          cvc={cardData.cvc || ""}
          focused={focus as any}
          placeholders={{ name: "FULL NAME" }}
        />
      </div>
    </div>
  );
};

export default CreditCardInput;
