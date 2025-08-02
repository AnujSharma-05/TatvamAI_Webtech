import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../../config/axios";
import { Eye, EyeOff } from "lucide-react";
import { COLORS } from "@/config/theme"; 

const StyledInput = React.forwardRef<HTMLInputElement, any>(({ ...props }, ref) => (
    <input ref={ref} {...props} className="w-full px-4 py-3 bg-transparent border rounded-xl placeholder:text-slate-500 focus:outline-none focus:ring-2" style={{ borderColor: `${COLORS.cadetGray}30`, color: COLORS.nyanza, '--tw-ring-color': COLORS.teaGreen } as React.CSSProperties}/>
));

const StyledSelect = React.forwardRef<HTMLSelectElement, any>(({ children, ...props }, ref) => (
    <select ref={ref} {...props} className="w-full px-4 py-3 bg-transparent border rounded-xl appearance-none focus:outline-none focus:ring-2" style={{ borderColor: `${COLORS.cadetGray}30`, color: COLORS.nyanza, '--tw-ring-color': COLORS.teaGreen } as React.CSSProperties}>
        {children}
    </select>
));

type Step = 1 | 2;
type Gender = "male" | "female" | "other";
type VerificationStatus = { phone: "pending" | "sent" | "verified"; email: "pending" | "sent" | "verified"; };
type FormData = { name: string; gender: Gender; dob: string; phone: string; email: string; city: string; motherTongue: string; knownLanguages: string[]; password: string; confirmPassword: string; };
const languages = ["Hindi", "Bengali", "Tamil", "Gujarati", "Punjabi", "Kannada", "Malayalam", "Marathi", "Telugu", "Urdu"];

export default function SignUpPage() {
    // --- State Management (Combined) ---
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>(1);
    const [phoneOtp, setPhoneOtp] = useState("");
    const [emailOtp, setEmailOtp] = useState("");
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({ phone: "pending", email: "pending" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isCheckingExistence, setIsCheckingExistence] = useState(false);
    const [isSendingPhoneOtp, setIsSendingPhoneOtp] = useState(false);
    const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
    const [isVerifyingPhoneOtp, setIsVerifyingPhoneOtp] = useState(false);
    const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false);
    const [formData, setFormData] = useState<FormData>({ name: "", gender: "male", dob: "", phone: "", email: "", city: "", motherTongue: "", knownLanguages: [], password: "", confirmPassword: "" });
    
  
    const validatePhoneNumber = (phone: string) => /^[6-9]\d{9}$/.test(phone);

    const checkUserExistence = async (phone: string, email: string) => {
        try {
            const requestBody: { phoneNo?: string; email?: string } = {};
            if (phone) requestBody.phoneNo = phone;
            if (email) requestBody.email = email;
            if (!phone && !email) return false;
            const response = await axios.post("/users/check-user-existence", requestBody);
            return response.status === 200;
        } catch (error: any) {
            if (error.response?.status === 404) return false;
            throw error;
        }
    };

    const handleSendPhoneOtp = async () => {
        if (!formData.phone || !validatePhoneNumber(formData.phone)) { toast.error("Please enter a valid 10-digit phone number."); return; }
        setIsSendingPhoneOtp(true);
        try {
            await axios.post("/users/send-phone-otp-register", { phoneNo: formData.phone });
            setVerificationStatus((prev) => ({ ...prev, phone: "sent" }));
            toast.success("OTP sent to your phone!");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to send OTP");
        } finally {
            setIsSendingPhoneOtp(false);
        }
    };

    const handleVerifyPhoneOtp = async () => {
        if (!phoneOtp) { toast.error("Please enter OTP"); return; }
        setIsVerifyingPhoneOtp(true);
        try {
            await axios.post("/users/verify-phone-otp", { phoneNo: formData.phone, otp: phoneOtp });
            setVerificationStatus((prev) => ({ ...prev, phone: "verified" }));
            toast.success("Phone number verified!");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Invalid OTP");
        } finally {
            setIsVerifyingPhoneOtp(false);
        }
    };

    const handleSendEmailOtp = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) { toast.error("Please enter a valid email address."); return; }
        setIsSendingEmailOtp(true);
        try {
            await axios.post("/users/send-verification-code", { email: formData.email });
            setVerificationStatus((prev) => ({ ...prev, email: "sent" }));
            toast.success("Verification email sent!");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to send verification email");
        } finally {
            setIsSendingEmailOtp(false);
        }
    };

    const handleVerifyEmailOtp = async () => {
        if (!emailOtp) { toast.error("Please enter verification code"); return; }
        setIsVerifyingEmailOtp(true);
        try {
            await axios.post("/users/verify-email-code", { email: formData.email, code: emailOtp });
            setVerificationStatus((prev) => ({ ...prev, email: "verified" }));
            toast.success("Email verified!");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Invalid verification code");
        } finally {
            setIsVerifyingEmailOtp(false);
        }
    };

    const handleNext = async (e: React.FormEvent) => {
        e.preventDefault();
        const { password, confirmPassword, phone, email, motherTongue } = formData;
        if (password !== confirmPassword) { toast.error("Passwords do not match!"); return; }
        if (password.length < 6) { toast.error("Password must be at least 6 characters."); return; }
        if (!phone || !email || !motherTongue) { toast.error("Please fill all required fields."); return; }
        
        setIsCheckingExistence(true);
        try {
            const userExists = await checkUserExistence(phone, email);
            if (userExists) {
                toast.error("User with this phone or email already exists.");
            } else {
                setStep(2);
            }
        } catch (error) {
            toast.error("An error occurred while checking. Please try again.");
        } finally {
            setIsCheckingExistence(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (verificationStatus.phone !== "verified" || verificationStatus.email !== "verified") {
            toast.error("Please verify both phone and email to continue.");
            return;
        }
        try {
            const { phone, ...restData } = formData;
            const registrationData = { ...restData, phoneNo: phone, knownLanguages: formData.knownLanguages.join(",") };
            await axios.post("/users/register", registrationData);
            toast.success("Account created successfully!");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to create account.");
        }
    };

    return (
        <div style={{ background: 'transparent' }} className="relative min-h-screen flex items-center justify-center p-4">
            <motion.div
                className="relative z-10 w-full max-w-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <div className="p-8 md:p-10 rounded-2xl" style={{ background: `linear-gradient(145deg, ${COLORS.midnightGreen}40, #002a3580)`, border: `1px solid ${COLORS.cadetGray}20`, backdropFilter: 'blur(12px)', boxShadow: `0 8px 32px 0 ${COLORS.midnightGreen}50` }}>
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-extrabold mb-2" style={{ color: COLORS.nyanza }}>Join <span style={{ color: COLORS.teaGreen }}>TatvamAI</span></h1>
                        <p style={{ color: COLORS.cadetGray }}>Help us build India's most powerful voice dataset.</p>
                    </div>

                    <div className="flex justify-center items-center mb-8">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold" style={{ background: step >= 1 ? COLORS.teaGreen : `${COLORS.midnightGreen}40`, color: step >= 1 ? COLORS.midnightGreen : COLORS.cadetGray }}>1</div>
                        <div className="w-16 h-1 mx-2 rounded" style={{ background: step >= 2 ? COLORS.teaGreen : `${COLORS.midnightGreen}40` }} />
                        <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold" style={{ background: step >= 2 ? COLORS.teaGreen : `${COLORS.midnightGreen}40`, color: step >= 2 ? COLORS.midnightGreen : COLORS.cadetGray }}>2</div>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleNext} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <StyledInput type="text" placeholder="Full Name *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                <StyledSelect value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })} required>
                                    <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                                </StyledSelect>
                                <StyledInput type="date" placeholder="Date of Birth *" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} required />
                                <StyledInput type="text" placeholder="City *" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
                                <StyledInput type="tel" placeholder="Phone Number *" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required maxLength={10} />
                                <StyledInput type="email" placeholder="Email Address *" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                                <StyledSelect value={formData.motherTongue} onChange={(e) => setFormData({ ...formData, motherTongue: e.target.value })} required>
                                    <option value="">Select Mother Tongue *</option>
                                    {languages.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
                                </StyledSelect>
                                <div /> {/* Spacer */}
                                <div className="relative">
                                    <StyledInput type={showPassword ? "text" : "password"} placeholder="Password *" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center"><EyeOff size={20} style={{color: COLORS.cadetGray}} /></button>
                                </div>
                                <div className="relative">
                                    <StyledInput type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password *" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required minLength={6} />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center"><Eye size={20} style={{color: COLORS.cadetGray}} /></button>
                                </div>
                            </div>
                            <button type="submit" disabled={isCheckingExistence} className="w-full py-3 rounded-xl font-semibold transition-all" style={{ background: COLORS.teaGreen, color: COLORS.midnightGreen, opacity: isCheckingExistence ? 0.7 : 1 }}>
                                {isCheckingExistence ? "Checking..." : "Next - Verify Contact"}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="p-4 rounded-xl" style={{background: `${COLORS.midnightGreen}20`}}>
                                <h3 className="font-semibold mb-3 flex items-center" style={{color: COLORS.nyanza}}>Phone Verification {verificationStatus.phone === "verified" && <span className="ml-2 text-xs font-bold" style={{color: COLORS.teaGreen}}>✓ VERIFIED</span>}</h3>
                                {verificationStatus.phone !== 'verified' && (
                                    verificationStatus.phone === 'pending' ? <button onClick={handleSendPhoneOtp} disabled={isSendingPhoneOtp} className="px-4 py-2 text-sm rounded-lg font-semibold" style={{background: COLORS.teaGreen, color: COLORS.midnightGreen}}>{isSendingPhoneOtp ? "Sending..." : "Send OTP"}</button>
                                    : <div className="flex gap-4"><StyledInput type="text" placeholder="Enter OTP" value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} maxLength={6} /><button onClick={handleVerifyPhoneOtp} disabled={isVerifyingPhoneOtp} className="px-4 py-2 text-sm rounded-lg font-semibold" style={{background: COLORS.teaGreen, color: COLORS.midnightGreen}}>{isVerifyingPhoneOtp ? "Verifying..." : "Verify"}</button></div>
                                )}
                            </div>
                            <div className="p-4 rounded-xl" style={{background: `${COLORS.midnightGreen}20`}}>
                                <h3 className="font-semibold mb-3 flex items-center" style={{color: COLORS.nyanza}}>Email Verification {verificationStatus.email === "verified" && <span className="ml-2 text-xs font-bold" style={{color: COLORS.teaGreen}}>✓ VERIFIED</span>}</h3>
                                {verificationStatus.email !== 'verified' && (
                                    verificationStatus.email === 'pending' ? <button onClick={handleSendEmailOtp} disabled={isSendingEmailOtp} className="px-4 py-2 text-sm rounded-lg font-semibold" style={{background: COLORS.teaGreen, color: COLORS.midnightGreen}}>{isSendingEmailOtp ? "Sending..." : "Send Code"}</button>
                                    : <div className="flex gap-4"><StyledInput type="text" placeholder="Enter Code" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} maxLength={6} /><button onClick={handleVerifyEmailOtp} disabled={isVerifyingEmailOtp} className="px-4 py-2 text-sm rounded-lg font-semibold" style={{background: COLORS.teaGreen, color: COLORS.midnightGreen}}>{isVerifyingEmailOtp ? "Verifying..." : "Verify"}</button></div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold mb-3" style={{color: COLORS.nyanza}}>Known Languages</h3>
                                {/* --- THE CORRECTED LINE --- */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm" style={{color: COLORS.cadetGray}}>
                                    {languages.map((lang) => (<label key={lang} className="flex items-center gap-2"><input type="checkbox" checked={formData.knownLanguages.includes(lang)} onChange={(e) => setFormData({...formData, knownLanguages: e.target.checked ? [...formData.knownLanguages, lang] : formData.knownLanguages.filter((l) => l !== lang)})} className="rounded bg-transparent border-2" style={{borderColor: `${COLORS.cadetGray}40`, accentColor: COLORS.teaGreen}}/>{lang}</label>))}
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setStep(1)} className="w-full py-3 rounded-xl font-semibold" style={{background: `${COLORS.cadetGray}20`, color: COLORS.nyanza}}>Back</button>
                                <button onClick={handleSubmit} className="w-full py-3 rounded-xl font-semibold" style={{background: COLORS.teaGreen, color: COLORS.midnightGreen}}>Create Account</button>
                            </div>
                        </div>
                    )}
                </div>
                <p className="text-center mt-8" style={{ color: COLORS.cadetGray }}>Already have an account?{' '}<Link to="/auth/signin" className="font-semibold hover:underline" style={{ color: COLORS.teaGreen }}>Sign in</Link></p>
            </motion.div>
        </div>
    );
}