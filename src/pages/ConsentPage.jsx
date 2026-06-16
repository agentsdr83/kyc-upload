import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";

export default function ConsentPage() {
  const { leadId } = useParams();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [verificationAccepted, setVerificationAccepted] =
    useState(false);

  const [showOtpSection, setShowOtpSection] =
    useState(false);

  const [consentVerified, setConsentVerified] =
    useState(false);

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const otpRefs = useRef([]);

  const allConsentsAccepted =
    termsAccepted &&
    verificationAccepted;

  const handleOtpChange = (
    value,
    index
  ) => {
    if (!/^\d?$/.test(value))
      return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;

    setOtp(updatedOtp);

    if (
      value &&
      index < 5
    ) {
      otpRefs.current[
        index + 1
      ]?.focus();
    }
  };

  const handleVerifyOtp =
    () => {
      const enteredOtp =
        otp.join("");

      if (
        enteredOtp.length !==
        6
      ) {
        alert(
          "Please enter a valid OTP"
        );
        return;
      }

      setConsentVerified(
        true
      );
    };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}

        <div className="bg-blue-700 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="text-5xl">
              🏠
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Home Loan Consent
              </h1>

              <p className="opacity-90 mt-1">
                Review and
                authorize your
                Home Loan
                application
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Application */}

          <div className="bg-gray-50 border rounded-xl p-4 mb-6">
            <div className="text-sm text-gray-500">
              Application ID
            </div>

            <div className="font-semibold text-lg">
              {leadId}
            </div>

            <div className="text-sm text-gray-500 mt-1">
              Lending Partner:
              Deloitte Home
              Loans
            </div>
          </div>

          {/* Terms */}

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              Terms &
              Conditions
            </h2>

            <div className="space-y-3 text-gray-700 text-sm leading-6">
              <p>
                Deloitte Home
                Loans may
                collect,
                process and
                verify
                information
                provided for
                evaluating and
                processing your
                Home Loan
                application.
              </p>

              <p>
                Information may
                be shared with
                authorized
                lenders,
                financial
                institutions
                and service
                providers solely
                for Home Loan
                processing.
              </p>

              <p>
                Loan approval
                remains subject
                to lender
                eligibility,
                policy checks,
                document
                verification and
                credit
                assessment.
              </p>

              <p>
                Your personal
                information will
                be protected in
                accordance with
                applicable laws
                and internal
                security
                standards.
              </p>
            </div>
          </div>

          {/* Consents */}

          <div className="space-y-5">
            <label className="flex gap-3 items-start cursor-pointer">
              <input
                type="checkbox"
                checked={
                  termsAccepted
                }
                onChange={(e) =>
                  setTermsAccepted(
                    e.target
                      .checked
                  )
                }
                className="mt-1"
              />

              <span className="text-gray-700">
                I confirm that
                all information
                and documents
                submitted by me
                are true and
                accurate. I
                have read,
                understood and
                agree to the
                Terms &
                Conditions
                governing the
                Home Loan
                application
                process.
              </span>
            </label>

            <label className="flex gap-3 items-start cursor-pointer">
              <input
                type="checkbox"
                checked={
                  verificationAccepted
                }
                onChange={(e) =>
                  setVerificationAccepted(
                    e.target
                      .checked
                  )
                }
                className="mt-1"
              />

              <span className="text-gray-700">
                I authorize
                Deloitte and
                its lending
                partners to
                verify my KYC,
                employment,
                income, credit
                bureau
                information and
                contact me via
                phone, SMS,
                email or
                WhatsApp
                regarding my
                Home Loan
                application.
              </span>
            </label>
          </div>

          {/* Agree Button */}

          {allConsentsAccepted &&
            !showOtpSection && (
              <div className="mt-8">
                <button
                  onClick={() =>
                    setShowOtpSection(
                      true
                    )
                  }
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold text-lg"
                >
                  Agree &
                  Continue
                </button>
              </div>
            )}

          {/* OTP */}

          {showOtpSection && (
            <div className="mt-10 border-t pt-8">
              <h3 className="text-xl font-bold mb-2">
                OTP
                Verification
              </h3>

              <p className="text-gray-500 mb-6">
                OTP has been
                sent to your
                registered
                mobile number
                +91 XXXXXXX123
              </p>

              <div className="flex justify-center gap-3 mb-8">
                {otp.map(
                  (
                    digit,
                    index
                  ) => (
                    <input
                      key={
                        index
                      }
                      ref={(
                        el
                      ) =>
                        (otpRefs.current[
                          index
                        ] =
                          el)
                      }
                      type="password"
                      inputMode="numeric"
                      maxLength={
                        1
                      }
                      value={
                        digit
                      }
                      onChange={(
                        e
                      ) =>
                        handleOtpChange(
                          e
                            .target
                            .value,
                          index
                        )
                      }
                      className="w-14 h-16 border-2 rounded-xl text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )
                )}
              </div>

              {!consentVerified && (
                <button
                  onClick={
                    handleVerifyOtp
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold"
                >
                  Verify OTP
                </button>
              )}
            </div>
          )}

          {/* Success */}

          {consentVerified && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl">
                  ✅
                </div>

                <div>
                  <h3 className="font-bold text-green-700 text-lg">
                    Consent
                    Successfully
                    Verified
                  </h3>

                  <p className="text-green-600">
                    Your Home
                    Loan
                    application
                    has been
                    successfully
                    authorized.
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