import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "@/components/ui/Form/FormInput";
import Checkbox from "@/components/ui/Form/FormCheckbox";
import FormButton from "@/components/ui/Form/FormButton";
import { addUser } from "@/lib/api/endpoints";

type SignupForm = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

type FormStatus = {
  type: "success" | "error" | null;
  message: string;
};

type Country = {
  name: string;
  code: string;
  dialCode: string;
};

const COUNTRIES: Country[] = [
  { name: "Afghanistan", code: "AF", dialCode: "+93" },
  { name: "Albania", code: "AL", dialCode: "+355" },
  { name: "Algeria", code: "DZ", dialCode: "+213" },
  { name: "American Samoa", code: "AS", dialCode: "+1-684" },
  { name: "Andorra", code: "AD", dialCode: "+376" },
  { name: "Angola", code: "AO", dialCode: "+244" },
  { name: "Anguilla", code: "AI", dialCode: "+1-264" },
  { name: "Antigua and Barbuda", code: "AG", dialCode: "+1-268" },
  { name: "Argentina", code: "AR", dialCode: "+54" },
  { name: "Armenia", code: "AM", dialCode: "+374" },
  { name: "Aruba", code: "AW", dialCode: "+297" },
  { name: "Australia", code: "AU", dialCode: "+61" },
  { name: "Austria", code: "AT", dialCode: "+43" },
  { name: "Azerbaijan", code: "AZ", dialCode: "+994" },
  { name: "Bahamas", code: "BS", dialCode: "+1-242" },
  { name: "Bahrain", code: "BH", dialCode: "+973" },
  { name: "Bangladesh", code: "BD", dialCode: "+880" },
  { name: "Barbados", code: "BB", dialCode: "+1-246" },
  { name: "Belarus", code: "BY", dialCode: "+375" },
  { name: "Belgium", code: "BE", dialCode: "+32" },
  { name: "Belize", code: "BZ", dialCode: "+501" },
  { name: "Benin", code: "BJ", dialCode: "+229" },
  { name: "Bermuda", code: "BM", dialCode: "+1-441" },
  { name: "Bhutan", code: "BT", dialCode: "+975" },
  { name: "Bolivia", code: "BO", dialCode: "+591" },
  { name: "Bosnia and Herzegovina", code: "BA", dialCode: "+387" },
  { name: "Botswana", code: "BW", dialCode: "+267" },
  { name: "Brazil", code: "BR", dialCode: "+55" },
  { name: "British Virgin Islands", code: "VG", dialCode: "+1-284" },
  { name: "Brunei", code: "BN", dialCode: "+673" },
  { name: "Bulgaria", code: "BG", dialCode: "+359" },
  { name: "Burkina Faso", code: "BF", dialCode: "+226" },
  { name: "Burundi", code: "BI", dialCode: "+257" },
  { name: "Cambodia", code: "KH", dialCode: "+855" },
  { name: "Cameroon", code: "CM", dialCode: "+237" },
  { name: "Canada", code: "CA", dialCode: "+1" },
  { name: "Cape Verde", code: "CV", dialCode: "+238" },
  { name: "Cayman Islands", code: "KY", dialCode: "+1-345" },
  { name: "Central African Republic", code: "CF", dialCode: "+236" },
  { name: "Chad", code: "TD", dialCode: "+235" },
  { name: "Chile", code: "CL", dialCode: "+56" },
  { name: "China", code: "CN", dialCode: "+86" },
  { name: "Colombia", code: "CO", dialCode: "+57" },
  { name: "Comoros", code: "KM", dialCode: "+269" },
  { name: "Congo - Brazzaville", code: "CG", dialCode: "+242" },
  { name: "Congo - Kinshasa", code: "CD", dialCode: "+243" },
  { name: "Costa Rica", code: "CR", dialCode: "+506" },
  { name: "Côte d’Ivoire", code: "CI", dialCode: "+225" },
  { name: "Croatia", code: "HR", dialCode: "+385" },
  { name: "Cuba", code: "CU", dialCode: "+53" },
  { name: "Cyprus", code: "CY", dialCode: "+357" },
  { name: "Czech Republic", code: "CZ", dialCode: "+420" },
  { name: "Denmark", code: "DK", dialCode: "+45" },
  { name: "Djibouti", code: "DJ", dialCode: "+253" },
  { name: "Dominica", code: "DM", dialCode: "+1-767" },
  { name: "Dominican Republic", code: "DO", dialCode: "+1-809" },
  { name: "Ecuador", code: "EC", dialCode: "+593" },
  { name: "Egypt", code: "EG", dialCode: "+20" },
  { name: "El Salvador", code: "SV", dialCode: "+503" },
  { name: "Equatorial Guinea", code: "GQ", dialCode: "+240" },
  { name: "Eritrea", code: "ER", dialCode: "+291" },
  { name: "Estonia", code: "EE", dialCode: "+372" },
  { name: "Eswatini", code: "SZ", dialCode: "+268" },
  { name: "Ethiopia", code: "ET", dialCode: "+251" },
  { name: "Fiji", code: "FJ", dialCode: "+679" },
  { name: "Finland", code: "FI", dialCode: "+358" },
  { name: "France", code: "FR", dialCode: "+33" },
  { name: "Gabon", code: "GA", dialCode: "+241" },
  { name: "Gambia", code: "GM", dialCode: "+220" },
  { name: "Georgia", code: "GE", dialCode: "+995" },
  { name: "Germany", code: "DE", dialCode: "+49" },
  { name: "Ghana", code: "GH", dialCode: "+233" },
  { name: "Gibraltar", code: "GI", dialCode: "+350" },
  { name: "Greece", code: "GR", dialCode: "+30" },
  { name: "Greenland", code: "GL", dialCode: "+299" },
  { name: "Grenada", code: "GD", dialCode: "+1-473" },
  { name: "Guam", code: "GU", dialCode: "+1-671" },
  { name: "Guatemala", code: "GT", dialCode: "+502" },
  { name: "Guinea", code: "GN", dialCode: "+224" },
  { name: "Guinea-Bissau", code: "GW", dialCode: "+245" },
  { name: "Guyana", code: "GY", dialCode: "+592" },
  { name: "Haiti", code: "HT", dialCode: "+509" },
  { name: "Honduras", code: "HN", dialCode: "+504" },
  { name: "Hong Kong", code: "HK", dialCode: "+852" },
  { name: "Hungary", code: "HU", dialCode: "+36" },
  { name: "Iceland", code: "IS", dialCode: "+354" },
  { name: "India", code: "IN", dialCode: "+91" },
  { name: "Indonesia", code: "ID", dialCode: "+62" },
  { name: "Iran", code: "IR", dialCode: "+98" },
  { name: "Iraq", code: "IQ", dialCode: "+964" },
  { name: "Ireland", code: "IE", dialCode: "+353" },
  { name: "Israel", code: "IL", dialCode: "+972" },
  { name: "Italy", code: "IT", dialCode: "+39" },
  { name: "Jamaica", code: "JM", dialCode: "+1-876" },
  { name: "Japan", code: "JP", dialCode: "+81" },
  { name: "Jordan", code: "JO", dialCode: "+962" },
  { name: "Kazakhstan", code: "KZ", dialCode: "+7" },
  { name: "Kenya", code: "KE", dialCode: "+254" },
  { name: "Kiribati", code: "KI", dialCode: "+686" },
  { name: "Kuwait", code: "KW", dialCode: "+965" },
  { name: "Kyrgyzstan", code: "KG", dialCode: "+996" },
  { name: "Laos", code: "LA", dialCode: "+856" },
  { name: "Latvia", code: "LV", dialCode: "+371" },
  { name: "Lebanon", code: "LB", dialCode: "+961" },
  { name: "Lesotho", code: "LS", dialCode: "+266" },
  { name: "Liberia", code: "LR", dialCode: "+231" },
  { name: "Libya", code: "LY", dialCode: "+218" },
  { name: "Liechtenstein", code: "LI", dialCode: "+423" },
  { name: "Lithuania", code: "LT", dialCode: "+370" },
  { name: "Luxembourg", code: "LU", dialCode: "+352" },
  { name: "Macau", code: "MO", dialCode: "+853" },
  { name: "Madagascar", code: "MG", dialCode: "+261" },
  { name: "Malawi", code: "MW", dialCode: "+265" },
  { name: "Malaysia", code: "MY", dialCode: "+60" },
  { name: "Maldives", code: "MV", dialCode: "+960" },
  { name: "Mali", code: "ML", dialCode: "+223" },
  { name: "Malta", code: "MT", dialCode: "+356" },
  { name: "Marshall Islands", code: "MH", dialCode: "+692" },
  { name: "Mauritania", code: "MR", dialCode: "+222" },
  { name: "Mauritius", code: "MU", dialCode: "+230" },
  { name: "Mexico", code: "MX", dialCode: "+52" },
  { name: "Micronesia", code: "FM", dialCode: "+691" },
  { name: "Moldova", code: "MD", dialCode: "+373" },
  { name: "Monaco", code: "MC", dialCode: "+377" },
  { name: "Mongolia", code: "MN", dialCode: "+976" },
  { name: "Montenegro", code: "ME", dialCode: "+382" },
  { name: "Morocco", code: "MA", dialCode: "+212" },
  { name: "Mozambique", code: "MZ", dialCode: "+258" },
  { name: "Myanmar", code: "MM", dialCode: "+95" },
  { name: "Namibia", code: "NA", dialCode: "+264" },
  { name: "Nauru", code: "NR", dialCode: "+674" },
  { name: "Nepal", code: "NP", dialCode: "+977" },
  { name: "Netherlands", code: "NL", dialCode: "+31" },
  { name: "New Zealand", code: "NZ", dialCode: "+64" },
  { name: "Nicaragua", code: "NI", dialCode: "+505" },
  { name: "Niger", code: "NE", dialCode: "+227" },
  { name: "Nigeria", code: "NG", dialCode: "+234" },
  { name: "North Korea", code: "KP", dialCode: "+850" },
  { name: "North Macedonia", code: "MK", dialCode: "+389" },
  { name: "Norway", code: "NO", dialCode: "+47" },
  { name: "Oman", code: "OM", dialCode: "+968" },
  { name: "Pakistan", code: "PK", dialCode: "+92" },
  { name: "Palau", code: "PW", dialCode: "+680" },
  { name: "Panama", code: "PA", dialCode: "+507" },
  { name: "Papua New Guinea", code: "PG", dialCode: "+675" },
  { name: "Paraguay", code: "PY", dialCode: "+595" },
  { name: "Peru", code: "PE", dialCode: "+51" },
  { name: "Philippines", code: "PH", dialCode: "+63" },
  { name: "Poland", code: "PL", dialCode: "+48" },
  { name: "Portugal", code: "PT", dialCode: "+351" },
  { name: "Puerto Rico", code: "PR", dialCode: "+1-787" },
  { name: "Qatar", code: "QA", dialCode: "+974" },
  { name: "Romania", code: "RO", dialCode: "+40" },
  { name: "Russia", code: "RU", dialCode: "+7" },
  { name: "Rwanda", code: "RW", dialCode: "+250" },
  { name: "Saint Kitts and Nevis", code: "KN", dialCode: "+1-869" },
  { name: "Saint Lucia", code: "LC", dialCode: "+1-758" },
  { name: "Saint Vincent and the Grenadines", code: "VC", dialCode: "+1-784" },
  { name: "Samoa", code: "WS", dialCode: "+685" },
  { name: "San Marino", code: "SM", dialCode: "+378" },
  { name: "São Tomé and Príncipe", code: "ST", dialCode: "+239" },
  { name: "Saudi Arabia", code: "SA", dialCode: "+966" },
  { name: "Senegal", code: "SN", dialCode: "+221" },
  { name: "Serbia", code: "RS", dialCode: "+381" },
  { name: "Seychelles", code: "SC", dialCode: "+248" },
  { name: "Sierra Leone", code: "SL", dialCode: "+232" },
  { name: "Singapore", code: "SG", dialCode: "+65" },
  { name: "Slovakia", code: "SK", dialCode: "+421" },
  { name: "Slovenia", code: "SI", dialCode: "+386" },
  { name: "Solomon Islands", code: "SB", dialCode: "+677" },
  { name: "Somalia", code: "SO", dialCode: "+252" },
  { name: "South Africa", code: "ZA", dialCode: "+27" },
  { name: "South Korea", code: "KR", dialCode: "+82" },
  { name: "South Sudan", code: "SS", dialCode: "+211" },
  { name: "Spain", code: "ES", dialCode: "+34" },
  { name: "Sri Lanka", code: "LK", dialCode: "+94" },
  { name: "Sudan", code: "SD", dialCode: "+249" },
  { name: "Suriname", code: "SR", dialCode: "+597" },
  { name: "Sweden", code: "SE", dialCode: "+46" },
  { name: "Switzerland", code: "CH", dialCode: "+41" },
  { name: "Syria", code: "SY", dialCode: "+963" },
  { name: "Taiwan", code: "TW", dialCode: "+886" },
  { name: "Tajikistan", code: "TJ", dialCode: "+992" },
  { name: "Tanzania", code: "TZ", dialCode: "+255" },
  { name: "Thailand", code: "TH", dialCode: "+66" },
  { name: "Timor-Leste", code: "TL", dialCode: "+670" },
  { name: "Togo", code: "TG", dialCode: "+228" },
  { name: "Tonga", code: "TO", dialCode: "+676" },
  { name: "Trinidad and Tobago", code: "TT", dialCode: "+1-868" },
  { name: "Tunisia", code: "TN", dialCode: "+216" },
  { name: "Turkey", code: "TR", dialCode: "+90" },
  { name: "Turkmenistan", code: "TM", dialCode: "+993" },
  { name: "Tuvalu", code: "TV", dialCode: "+688" },
  { name: "Uganda", code: "UG", dialCode: "+256" },
  { name: "Ukraine", code: "UA", dialCode: "+380" },
  { name: "United Arab Emirates", code: "AE", dialCode: "+971" },
  { name: "United Kingdom", code: "GB", dialCode: "+44" },
  { name: "United States", code: "US", dialCode: "+1" },
  { name: "Uruguay", code: "UY", dialCode: "+598" },
  { name: "Uzbekistan", code: "UZ", dialCode: "+998" },
  { name: "Vanuatu", code: "VU", dialCode: "+678" },
  { name: "Vatican City", code: "VA", dialCode: "+39-06" },
  { name: "Venezuela", code: "VE", dialCode: "+58" },
  { name: "Vietnam", code: "VN", dialCode: "+84" },
  { name: "Yemen", code: "YE", dialCode: "+967" },
  { name: "Zambia", code: "ZM", dialCode: "+260" },
  { name: "Zimbabwe", code: "ZW", dialCode: "+263" },
];

const INITIAL_FORM: SignupForm = {
  name: "",
  phone: "",
  email: "",
  password: "",
};

function Signup() {
  const [formValues, setFormValues] = useState<SignupForm>(INITIAL_FORM);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]); // Default to Nigeria
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRIES;
    const search = countrySearch.toLowerCase();
    return COUNTRIES.filter(
      (country) =>
        country.name.toLowerCase().includes(search) ||
        country.dialCode.includes(search) ||
        country.code.toLowerCase().includes(search)
    );
  }, [countrySearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCountryDropdown(false);
      }
    };

    if (showCountryDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showCountryDropdown]);
  const handleTermsChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAcceptTerms(event.target.checked);
    },
    []
  );

  const passwordChecklist = useMemo(() => {
    const password = formValues.password;
    const checks = [
      {
        id: "length",
        label: "At least 8 characters",
        met: password.length >= 8,
      },
      {
        id: "number",
        label: "Contains a number",
        met: /\d/.test(password),
      },
      {
        id: "symbol",
        label: "Has a special character",
        met: /[^A-Za-z0-9]/.test(password),
      },
    ];

    const metCount = checks.filter((check) => check.met).length;
    return { checks, metCount };
  }, [formValues.password]);

  const isSubmitDisabled = useMemo(() => {
    const { name, email, password, phone } = formValues;
    return (
      !acceptTerms ||
      !name.trim() ||
      !email.trim() ||
      !password ||
      !phone.trim() ||
      isSubmitting
    );
  }, [acceptTerms, formValues, isSubmitting]);

  const handleInputChange = useCallback(
    (field: keyof SignupForm) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setFormValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: null, message: "" });

      if (isSubmitDisabled) {
      setStatus({
        type: "error",
        message:
          "Please fill in your name, email, phone number, password and accept the terms.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        password: formValues.password,
        phone: formValues.phone.trim(),
        countryCode: selectedCountry.dialCode,
      };

      await addUser(payload);

      setFormValues(INITIAL_FORM);
      setAcceptTerms(false);
      navigate("/onboard");
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to create account right now.";
      setStatus({ type: "error", message: apiMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="font-bold text-[32px] mb-4">Create Account</h1>

      <FormInput
        label="Full Name"
        type="text"
        placeholder="John Doe"
        icon="/assets/icons/user.png"
        value={formValues.name}
        onChange={handleInputChange("name")}
        required
      />

      <p className="mb-2">Phone Number</p>
      <div className="relative flex items-center gap-3 h-[44px] sm:h-[50px] md:h-[56px] w-full max-w-full sm:max-w-md md:max-w-lg border border-snow-200 px-3 sm:px-4 mb-4 rounded-[8px]">
        <div className="relative" ref={countryDropdownRef}>
          <button
            type="button"
            onClick={() => {
              setShowCountryDropdown(!showCountryDropdown);
              setCountrySearch("");
            }}
            className="flex items-center gap-1 p-1 sz-7 hover:bg-snow-100 rounded transition-colors"
          >
            <span>{selectedCountry.dialCode}</span>
            <svg
              className={`w-4 h-4 transition-transform ${showCountryDropdown ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showCountryDropdown && (
            <div className="absolute left-0 top-full mt-1 w-64 max-h-60 overflow-hidden bg-white border border-snow-200 rounded-lg shadow-lg z-20">
              <div className="p-2 border-b border-snow-200">
                <input
                  type="text"
                  placeholder="Search country..."
                  className="w-full px-3 py-2 text-sm border border-snow-200 rounded outline-none focus:border-brand-primary"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
              <div className="max-h-48 overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => {
                        setSelectedCountry(country);
                        setShowCountryDropdown(false);
                        setCountrySearch("");
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-brand-primary/5 transition-colors flex items-center justify-between ${
                        selectedCountry.code === country.code ? "bg-brand-primary/10" : ""
                      }`}
                    >
                      <span>{country.name}</span>
                      <span className="text-neutral-n5">{country.dialCode}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-neutral-n5 text-center">
                    No countries found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="py-3 w-[2px] bg-gray-200"></div>
        <input
          type="tel"
          placeholder="Enter your phone number"
          className="w-full text-[13px] sm:text-[14px] md:text-[15px] outline-none border-none"
          value={formValues.phone}
          onChange={handleInputChange("phone")}
        />
      </div>

      <FormInput
        label="Email Address"
        type="email"
        placeholder="example@gmail.com"
        icon="/assets/icons/mail-line-1.png"
        value={formValues.email}
        onChange={handleInputChange("email")}
        required
      />

      <FormInput
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="•••••••••"
        icon="/assets/icons/lock-line-1.png"
        secondIcon={
          showPassword
            ? "/assets/icons/eye-off-line.png"
            : "/assets/icons/eye-line.png"
        }
        secondIconAlt={showPassword ? "Hide password" : "Show password"}
        onSecondIconClick={() => setShowPassword((prev) => !prev)}
        value={formValues.password}
        onChange={handleInputChange("password")}
        required
      />

      <div aria-live="polite">
        <div className="flex gap-2 mb-3 items-stretch">
          <div
            className={`w-full rounded-2xl h-[12px] ${
              passwordChecklist.metCount >= 1 ? "bg-ui-negative" : "bg-snow-200"
            }`}
          ></div>
          <div
            className={`w-full rounded-2xl h-[12px] ${
              passwordChecklist.metCount >= 2 ? "bg-ui-pending" : "bg-snow-200"
            }`}
          ></div>
          <div
            className={`w-full rounded-2xl h-[12px] ${
              passwordChecklist.metCount >= 3 ? "bg-ui-success" : "bg-snow-200"
            }`}
          ></div>
        </div>
        <div className="space-y-2">
          {passwordChecklist.checks.map((check) => (
            <div className="flex gap-2 items-center" key={check.id}>
              <div
                className={`w-[12px] h-[12px] rounded ${
                  check.met ? "bg-ui-success" : "bg-snow-200"
                }`}
              ></div>
              <p
                className={`sz-7 ${
                  check.met ? "text-ui-success" : "text-neutral-n5"
                }`}
              >
                {check.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex sz-8  justify-between w-full mt-4 mb-4">
        <div className="gap-1 flex items-center">
          <Checkbox
            className="checkbox"
            checked={acceptTerms}
            onChange={handleTermsChange}it
          />
          <p>
            I agree to the{" "}
            <a href="#" className="text-brand-primary hover:underline">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-brand-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {status.message && (
        <p
          className={`mb-4 text-sm ${
            status.type === "error" ? "text-ui-negative" : "text-ui-success"
          }`}
        >
          {status.message}
        </p>
      )}

      <FormButton
        className={`btn-primary ${isSubmitting ? "opacity-60" : ""}`}
        label={isSubmitting ? "Creating Account..." : "SIGN UP"}
        disabled={isSubmitDisabled}
        type="submit"
      />

      <p className="sz-7 text-center mt-5 text-neutral-n5">or sign up with</p>
      <div className="flex gap-2 items-stretch mt-2">
        <FormButton
          className="btn-outline"
          label=""
          icon="/assets/icons/google.png"
          iconAlt="Google Icon"
          type="button"
        />
        <FormButton
          className="btn-outline"
          label=""
          icon="/assets/icons/twitter.png"
          iconAlt="Twitter Icon"
          type="button"
        />
        <FormButton
          className="btn-outline"
          label=""
          icon="/assets/icons/facebook-color.png"
          iconAlt="Facebook Icon"
          type="button"
        />
      </div>
    </form>
  );
}

export default Signup;
