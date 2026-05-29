import { FC, useEffect, useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { detectCardType, formatExpiry } from "../utils";
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

type CardFocus = "name" | "number" | "expiry" | "cvc";

const CreditCardInput: FC<CreditCardInputProps> = ({
  id,
  label = "Credit Card Information",
  value,
  onChange,
  disabled = false,
  showCVC = true,
}) => {
  const [focus, setFocus] = useState<CardFocus | undefined>();
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
    <div className="tat-credit-card" id={id}>
      {label && <h5 className="tat-credit-card-label">{label}</h5>}

      <div className="tat-credit-card-fields">
        {/* Name */}
        <div className="tat-credit-card-field">
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
        <div className="tat-credit-card-field">
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
        <div className="tat-credit-card-row">
          <div className="tat-credit-card-field">
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
            <div className="tat-credit-card-field">
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
        <div className="tat-credit-card-field">
          <label>Card Type</label>
          <input type="text" value={cardData.type || "Unknown"} disabled />
        </div>

        <Cards
          number={cardData.number}
          name={cardData.name}
          expiry={cardData.expiry}
          cvc={cardData.cvc || ""}
          focused={focus}
          placeholders={{ name: "FULL NAME" }}
        />
      </div>
    </div>
  );
};

export default CreditCardInput;
