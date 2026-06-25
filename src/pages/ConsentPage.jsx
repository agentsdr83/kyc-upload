import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ConsentPage() {
  const WHATSAPP_API =
    "https://j0e80xdyw4.execute-api.ap-south-1.amazonaws.com/InitiatePropertyTypeWhatsAppChat";
  const { leadId, mobile } = useParams();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [verificationAccepted, setVerificationAccepted] = useState(false);

  const [showOtpSection, setShowOtpSection] = useState(false);

  const [consentVerified, setConsentVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(30);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  useEffect(() => {
    if (!showOtpSection) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showOtpSection]);

  const otpRefs = useRef([]);

  const allConsentsAccepted = termsAccepted && verificationAccepted;

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;

    setOtp(updatedOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      alert("Please enter a valid OTP");
      return;
    }

    /*try {
      const messageBody = `Dear customer,\n\nTo proceed with your home loan application, please complete your KYC Verification by clicking the link below:\n\nhttps://main.d2s4uifsvainim.amplifyapp.com/kyc/${leadId}\n\nThis is a secure link. Please do not share it with anyone.`;

      const response = await fetch(WHATSAPP_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetPhoneNumber: mobile,
          messageBody,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send WhatsApp message");
      }

      console.log("WhatsApp Response:", data);

      setConsentVerified(true);
    } catch (error) {
      console.error(error);

      alert(error.message || "Failed to send WhatsApp message");
    }*/
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}

        <div className="bg-blue-700 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🏠</div>

            <div>
              <h1 className="text-3xl font-bold">Home Loan Consent</h1>

              <p className="opacity-90 mt-1">
                Review and authorize your Home Loan application
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Application */}

          <div className="bg-gray-50 border rounded-xl p-4 mb-6">
            <div className="text-sm text-gray-500">Application ID</div>

            <div className="font-semibold text-lg">{leadId}</div>

            <div className="text-sm text-gray-500 mt-1">
              Lending Partner: Deloitte Home Loans
            </div>
          </div>

          {/* Terms */}

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Terms & Conditions</h2>

            <div className="space-y-3 text-gray-700 text-sm leading-6">
              <p>
                Deloitte Home Loans may collect, process and verify information
                provided for evaluating and processing your Home Loan
                application.
              </p>

              <p>
                Information may be shared with authorized lenders, financial
                institutions and service providers solely for Home Loan
                processing.
              </p>

              <p>
                Loan approval remains subject to lender eligibility, policy
                checks, document verification and credit assessment.
              </p>

              <p>
                Your personal information will be protected in accordance with
                applicable laws and internal security standards.
              </p>
            </div>
          </div>

          {/* Consents */}

          <div className="space-y-5">
            <label className="flex gap-3 items-start cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1"
              />

              <span className="text-gray-700">
                I confirm that all information and documents submitted by me are
                true and accurate. I have read, understood and agree to the
                Terms & Conditions governing the Home Loan application process.
              </span>
            </label>

            <label className="flex gap-3 items-start cursor-pointer">
              <input
                type="checkbox"
                checked={verificationAccepted}
                onChange={(e) => setVerificationAccepted(e.target.checked)}
                className="mt-1"
              />

              <span className="text-gray-700">
                I authorize Deloitte and its lending partners to verify my KYC,
                employment, income, credit bureau information and contact me via
                phone, SMS, email or WhatsApp regarding my Home Loan
                application.
              </span>
            </label>
          </div>

          {/* Agree Button */}

          {allConsentsAccepted && !showOtpSection && (
            <div className="mt-8">
              <button
                onClick={() => {
                  setShowOtpSection(true);

                  setTimeout(() => {
                    otpRefs.current[0]?.focus();
                  }, 100);
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold text-lg"
              >
                Agree & Continue
              </button>
            </div>
          )}

          {/* OTP */}

          {/* OTP */}

          {showOtpSection && (
            <div className="mt-10 border-t pt-8">
              <div className="max-w-md mx-auto">
                <div className="bg-white border rounded-3xl shadow-lg p-8">
                  {/* Icon */}

                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
                      🔐
                    </div>
                  </div>

                  {/* Heading */}

                  <h3 className="text-2xl font-bold text-center text-gray-800">
                    OTP Verification
                  </h3>

                  <p className="text-center text-gray-500 mt-2">
                    Enter the 6-digit code sent to
                  </p>

                  <p className="text-center font-semibold text-blue-700 mt-1">
                    +91 {mobile?.slice(0, 2)}******{mobile?.slice(-2)}
                  </p>

                  {/* Banner */}

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6 text-center">
                    <p className="font-medium text-blue-700">
                      OTP sent successfully
                    </p>

                    <p className="text-sm text-blue-500 mt-1">
                      Please enter the code to continue
                    </p>
                  </div>

                  {/* OTP Inputs */}

                  <div className="flex justify-center gap-2 sm:gap-3 mt-8">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="password"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Backspace" &&
                            !otp[index] &&
                            index > 0
                          ) {
                            otpRefs.current[index - 1]?.focus();
                          }
                        }}
                        className="
                w-12 h-14 sm:w-14 sm:h-16
                border-2
                border-gray-300
                rounded-2xl
                text-center
                text-2xl
                font-bold
                shadow-sm
                focus:outline-none
                focus:border-blue-600
                focus:ring-4
                focus:ring-blue-100
                transition-all
              "
                      />
                    ))}
                  </div>

                  {/* Timer */}

                  <div className="text-center mt-6">
                    {timer > 0 ? (
                      <p className="text-sm text-gray-500">
                        Resend OTP in{" "}
                        <span className="font-semibold text-blue-600">
                          {timer}s
                        </span>
                      </p>
                    ) : (
                      <button
                        onClick={() => setTimer(30)}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  {/* Verify Button */}

                  {!consentVerified && (
                    <button
                      onClick={async () => {
                        setIsVerifying(true);

                        try {
                          await handleVerifyOtp();
                        } finally {
                          setIsVerifying(false);
                        }
                      }}
                      disabled={isVerifying}
                      className="
              w-full
              mt-8
              bg-gradient-to-r
              from-blue-600
              to-blue-700
              hover:from-blue-700
              hover:to-blue-800
              disabled:opacity-70
              text-white
              py-4
              rounded-xl
              font-semibold
              text-lg
              shadow-lg
              transition-all
            "
                    >
                      {isVerifying ? "Verifying..." : "Verify & Continue"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Success */}

          {consentVerified && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl">✅</div>

                <div>
                  <h3 className="font-bold text-green-700 text-lg">
                    Consent Successfully Verified
                  </h3>

                  <p className="text-green-600">
                    Consent captured successfully. A WhatsApp message containing
                    your KYC document upload link has been sent to your
                    registered mobile number.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
