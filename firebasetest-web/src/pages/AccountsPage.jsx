import React, { useState, useEffect } from "react";
import { signInWithGoogle, firebaseSignOut, auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { updateUserDetails } from "../api/userupdate";
import { IoLogoGoogle } from "react-icons/io5";

export default function AccountsPage() {
    const [user, setUser] = useState(null);
    const [mobileNumber, setMobileNumber] = useState("");
    const [userType, setUserType] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check localStorage first
        const stored = localStorage.getItem("@user");
        if (stored) {
            setUser(JSON.parse(stored));
            return;
        }
        // Listen for Firebase auth state
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const appUser = {
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName,
                    email: firebaseUser.email,
                };
                localStorage.setItem("@user", JSON.stringify(appUser));
                setUser(appUser);
            }
        });
        return unsub;
    }, []);

    const signupWithMobile = async (userinfo) => {
        try {
            const res = await fetch("/api/signupwithmobile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId: { uid: userinfo.id, name: userinfo.name, email: userinfo.email },
                }),
            });
            const data = await res.json();
            if (data.userdata) {
                localStorage.setItem("@user", JSON.stringify(data.userdata));
                setUser(data.userdata);
            }
        } catch (err) {
            console.error("Signup error:", err);
        }
    };

    const handleSignIn = async () => {
        setLoading(true);
        try {
            const result = await signInWithGoogle();
            if (result?.user) {
                const appUser = {
                    id: result.user.uid,
                    name: result.user.displayName,
                    email: result.user.email,
                };
                localStorage.setItem("@user", JSON.stringify(appUser));
                setUser(appUser);
                await signupWithMobile(appUser);
            }
        } catch (err) {
            alert("Could not sign in with Google.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await firebaseSignOut();
            localStorage.removeItem("@user");
            setUser(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateDetails = async () => {
        if (!user) return;
        const updatedUser = { ...user, mobileNumber, userType };
        localStorage.setItem("@user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        try {
            const userId = user.userid || user.id;
            await updateUserDetails(userId, { mobileNumber, userType });
            alert("User details updated!");
        } catch {
            alert("Failed to update user details.");
        }
    };

    if (!user) {
        return (
            <div className="centered-container">
                <h2 style={{ fontSize: 22, fontWeight: "bold", color: "#111827" }}>No user is logged in.</h2>
                <button className="btn-primary" onClick={handleSignIn} disabled={loading}>
                    {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : (
                        <>
                            <IoLogoGoogle size={20} />
                            Sign in with Google
                        </>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: 20 }}>
            <div className="card">
                <h2 style={{ fontSize: 22, fontWeight: "bold", color: "#10B981", textAlign: "center", marginBottom: 20 }}>
                    Account Details
                </h2>
                <div style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "#6B7280" }}>Name</span>
                    <p style={{ fontSize: 16, fontWeight: 600 }}>{user.name || "N/A"}</p>
                </div>
                <div className="divider" />
                <div style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "#6B7280" }}>Email</span>
                    <p style={{ fontSize: 16, fontWeight: 600 }}>{user.email}</p>
                </div>
                {user.mobileNumber && (
                    <>
                        <div className="divider" />
                        <div>
                            <span style={{ fontSize: 12, color: "#6B7280" }}>Mobile</span>
                            <p style={{ fontSize: 16, fontWeight: 600 }}>{user.mobileNumber}</p>
                        </div>
                    </>
                )}
            </div>

            {(!user.mobileNumber || !user.userType) && (
                <div className="card">
                    <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 15 }}>Complete Profile</h3>
                    <label className="form-label">Mobile Number</label>
                    <input
                        className="form-input"
                        placeholder="Enter Mobile Number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        type="tel"
                        style={{ marginBottom: 15 }}
                    />
                    <label className="form-label">Account Type</label>
                    <select
                        className="form-select"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        style={{ marginBottom: 20 }}
                    >
                        <option value="">Select User Type</option>
                        <option value="Muazzin">Muazzin</option>
                        <option value="Not Muazzin">Not Muazzin</option>
                    </select>
                    <button className="btn-primary" onClick={handleUpdateDetails} style={{ width: "100%" }}>
                        Update Details
                    </button>
                </div>
            )}

            <button className="btn-danger" onClick={handleSignOut} style={{ width: "100%" }}>
                Sign Out
            </button>
        </div>
    );
}
