import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, MapPin, DollarSign, Phone, AlertCircle, Info, 
  Maximize, Bed, Star, CheckCircle2, CreditCard, Loader2, 
  Camera, X, ChevronRight, Check
} from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { useState } from "react";
import { LocationPicker } from "../components/LocationPicker";
import { useProperties, Property } from "../context/PropertyContext";
import { useTranslation } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useRef } from "react";

interface AddListingScreenProps {
  onBack: () => void;
  onSubmit: () => void;
  editProperty?: Property;
}

type Step = "LOCATION" | "DETAILS" | "IMAGES" | "REVIEW";

export function AddListingScreen({ onBack, onSubmit, editProperty }: AddListingScreenProps) {
  const { addProperty, updateProperty } = useProperties();
  const { t } = useTranslation();
  const { isDemoMode, user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<Step>("LOCATION");
  const [formData, setFormData] = useState({
    type: editProperty?.type || "sale" as "sale" | "rent",
    title: editProperty?.title || "",
    price: editProperty?.price.replace("$", "") || "",
    district: editProperty?.district || "",
    lat: editProperty?.lat || null as number | null,
    lng: editProperty?.lng || null as number | null,
    address: editProperty?.address || "",
    description: editProperty?.description || "",
    phone: editProperty?.sellerPhone || "",
    rooms: editProperty?.rooms.toString() || "",
    size: editProperty?.size.toString() || "",
    isTop: editProperty?.isTop || false,
    images: editProperty?.images || [] as string[],
    status: editProperty?.status || "pending" as any,
  });
  
  const [selectedPayment, setSelectedPayment] = useState<"click" | "payme" | "stripe">("click");

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const districts = [
    "Qarshi", "Shahrisabz", "Kitob", "G'uzor", "Kasbi", 
    "Muborak", "Nishon", "Chiroqchi", "Yakkabog'", "Dehqonobod"
  ];

  // Steps configuration
  const steps: { key: Step; title: string }[] = [
    { key: "LOCATION", title: editProperty ? "Tahrirlash" : t("nav.add") },
    { key: "DETAILS", title: t("add.details") },
    { key: "IMAGES", title: t("add.images") },
    { key: "REVIEW", title: t("add.finish") },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  const validateStep = (step: Step): boolean => {
    const newErrors: string[] = [];
    if (step === "LOCATION") {
      if (!formData.district) newErrors.push(t("login.districtRequired"));
      if (!formData.address) newErrors.push(t("login.addressRequired"));
    } else if (step === "DETAILS") {
      if (!formData.title) newErrors.push(t("add.titleRequired"));
      if (!formData.price) newErrors.push(t("login.priceRequired"));
      if (!formData.phone) newErrors.push(t("login.phoneRequired"));
    } else if (step === "IMAGES") {
      if (formData.images.length < 4) newErrors.push(t("add.minImagesError"));
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === "LOCATION") setCurrentStep("DETAILS");
      else if (currentStep === "DETAILS") setCurrentStep("IMAGES");
      else if (currentStep === "IMAGES") setCurrentStep("REVIEW");
    }
  };

  const handlePrev = () => {
    if (currentStep === "DETAILS") setCurrentStep("LOCATION");
    else if (currentStep === "IMAGES") setCurrentStep("DETAILS");
    else if (currentStep === "REVIEW") setCurrentStep("IMAGES");
    setErrors([]);
  };

  const handleImageAdd = () => {
    if (formData.images.length >= 10) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setIsOptimizing(true);
    const files = Array.from(e.target.files);
    
    Promise.all(files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    })).then(base64Images => {
      setFormData(prev => {
        const newImages = [...prev.images, ...base64Images].slice(0, 10);
        return { ...prev, images: newImages };
      });
      setIsOptimizing(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_: string, i: number) => i !== index)
    }));
  };

  const finalSubmit = (statusOverride?: "draft" | "active") => {
    const status = statusOverride || formData.status;
    
    // If it's a NEW listing and user chose TOP, show payment. 
    // If it's an EDIT, we assume payment was already handled or handled separately.
    if (formData.isTop && status === "active" && !editProperty) {
      setIsPaymentOpen(true);
    } else {
      processSubmission(status);
    }
  };

  const processSubmission = (status: Property["status"]) => {
    setIsProcessing(true);
    setTimeout(() => {
      const propertyData = {
        image: formData.images[0] || "https://images.unsplash.com/photo-1663756915304-40b7eda63e41?w=1080",
        images: formData.images,
        title: formData.title,
        price: formData.price.startsWith("$") ? formData.price : `$${formData.price}`,
        location: `${formData.district}, ${formData.address.split(",")[0]}`,
        address: formData.address,
        district: formData.district,
        lat: formData.lat!,
        lng: formData.lng!,
        rooms: parseInt(formData.rooms) || 0,
        size: parseInt(formData.size) || 0,
        description: formData.description,
        type: formData.type,
        isTop: formData.isTop,
        topExpiresAt: formData.isTop ? Date.now() + 7 * 24 * 60 * 60 * 1000 : undefined,
        status: status,
        sellerName: user?.displayName || "Foydalanuvchi",
        sellerPhone: formData.phone,
      };

      if (editProperty) {
        updateProperty(editProperty.id, propertyData);
      } else {
        addProperty(propertyData as any);
      }
      setIsProcessing(false);
      onSubmit();
    }, 1500);
  };

  return (
    <div className="flex h-full flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-xl px-6 pt-8 pb-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground transition-all active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-black text-foreground tracking-tight">
                {steps[currentStepIndex].title}
              </h1>
              <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest leading-none">
                {t("add.step")} {currentStepIndex + 1} {t("add.of")} 4
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2">
          {steps.map((s, i) => (
            <div 
              key={s.key} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= currentStepIndex ? "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" : "bg-white/10"
              }`} 
            />
          ))}
        </div>
      </div>

      {/* Demo Mode Notice */}
      {isDemoMode && (
        <div className="bg-cyan-500/10 border-y border-cyan-500/20 px-6 py-2.5 flex items-center gap-3">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <p className="text-[10px] text-cyan-200/80 font-medium leading-tight">
            <span className="font-black uppercase tracking-wider text-cyan-400">Demo:</span> E'lon brauzerda saqlanadi.
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-40">
        <AnimatePresence mode="wait">
          {/* STEP 1: LOCATION */}
          {currentStep === "LOCATION" && (
            <motion.div
              key="location-step"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
              <section className="space-y-4">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">{t("common.district")}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {districts.map(d => (
                    <button
                      key={d}
                      onClick={() => setFormData({ ...formData, district: d })}
                      className={`px-4 py-3 rounded-xl border text-xs transition-all ${
                        formData.district === d ? "bg-white text-slate-950 border-white font-bold" : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-muted-foreground"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">{t("add.mapLocation")}</h3>
                <button 
                  onClick={() => setIsPickerOpen(true)}
                  className="w-full flex items-center gap-4 p-5 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-cyan-500/30 transition-all text-left group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${
                    formData.address ? "bg-cyan-500 text-slate-950" : "bg-black/5 dark:bg-white/5 text-muted-foreground"
                  }`}>
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      {formData.address || t("add.mapPlaceholder")}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">{t("add.subtitle")}</p>
                  </div>
                </button>
              </section>
            </motion.div>
          )}

          {/* STEP 2: DETAILS */}
          {currentStep === "DETAILS" && (
            <motion.div
              key="details-step"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                {["sale", "rent"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData({ ...formData, type: type as any })}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      formData.type === type ? "bg-white text-slate-950 shadow-xl" : "text-slate-500"
                    }`}
                  >
                    {type === "sale" ? t("add.sale") : t("add.rent")}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <Info className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={t("add.titlePlaceholder")}
                    className="w-full h-16 pl-14 pr-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-foreground font-bold outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600"
                  />
                </div>

                <div className="relative group">
                  <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder={t("add.pricePlaceholder")}
                    className="w-full h-16 pl-14 pr-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-foreground font-bold outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <Bed className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="number"
                      value={formData.rooms}
                      onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                      placeholder={t("add.roomsPlaceholder")}
                      className="w-full h-16 pl-14 pr-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-foreground font-bold outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600"
                    />
                  </div>
                  <div className="relative group">
                    <Maximize className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="number"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      placeholder={t("add.sizePlaceholder")}
                      className="w-full h-16 pl-14 pr-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-foreground font-bold outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t("add.descPlaceholder")}
                  rows={4}
                  className="w-full px-6 py-5 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-foreground font-medium outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600 resize-none"
                />

                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t("add.phonePlaceholder")}
                    className="w-full h-16 pl-14 pr-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-foreground font-bold outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: IMAGES */}
          {currentStep === "IMAGES" && (
            <motion.div
              key="images-step"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div className="bg-black/5 dark:bg-white/5 rounded-[2.5rem] p-8 border border-black/5 dark:border-white/5 text-center space-y-4">
                <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center mx-auto">
                  <Camera className="w-10 h-10 text-cyan-400" />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                />
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-foreground">{t("add.images")}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {t("add.imagesRequired")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {formData.images.map((img: string, idx: number) => (
                  <div key={idx} className="relative aspect-square rounded-3xl overflow-hidden group border border-black/5 dark:border-white/5">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {idx === 0 && (
                      <div className="absolute bottom-2 left-2 px-3 py-1 rounded-full bg-cyan-500 text-[8px] font-black uppercase tracking-widest text-slate-950">
                        Main
                      </div>
                    )}
                  </div>
                ))}
                
                {formData.images.length < 10 && (
                  <button 
                    onClick={handleImageAdd}
                    disabled={isOptimizing}
                    className="aspect-square rounded-3xl bg-black/5 dark:bg-white/5 border-2 border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-3 text-slate-500 hover:border-cyan-500/50 hover:text-cyan-400 transition-all disabled:opacity-50"
                  >
                    {isOptimizing ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-[8px] font-black uppercase tracking-widest">{t("add.optimizing")}</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
                          <Camera className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{t("add.addImage")}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  formData.images.length >= 4 ? "bg-cyan-500 text-slate-950" : "bg-white/10 text-slate-600"
                }`}>
                  {formData.images.length >= 4 ? <Check className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                </div>
                <p className={`text-xs font-bold ${formData.images.length >= 4 ? "text-cyan-400" : "text-slate-500"}`}>
                  {formData.images.length} / 4 {t("add.imagesRequired")}
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 4: REVIEW */}
          {currentStep === "REVIEW" && (
            <motion.div
              key="review-step"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
              <section>
                <button
                  onClick={() => setFormData({ ...formData, isTop: !formData.isTop })}
                  className={`w-full p-5 rounded-3xl border-2 transition-all text-left relative overflow-hidden group ${
                    formData.isTop ? "bg-cyan-500/10 border-cyan-500 shadow-lg shadow-cyan-500/20" : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 hover:border-black/10 dark:border-white/10"
                  }`}
                >
                  {formData.isTop && (
                    <div className="absolute top-0 right-0 p-2">
                      <Star className="w-6 h-6 text-cyan-400 fill-current" />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      formData.isTop ? "bg-cyan-500 text-slate-950" : "bg-black/5 dark:bg-white/5 text-muted-foreground"
                    }`}>
                      <Star className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground flex items-center gap-2">
                        {t("add.topTitle")}
                        <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">{t("add.topBadge")}</span>
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">{t("add.topDesc")}</p>
                    </div>
                  </div>
                </button>
              </section>

              <section className="space-y-4">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Publish Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setFormData({ ...formData, status: "pending" })}
                    className={`p-4 rounded-2xl border transition-all text-left space-y-2 ${
                      formData.status === "pending" || formData.status === "approved" || formData.status === "active" ? "bg-white border-white" : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-muted-foreground"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.status === "pending" || formData.status === "approved" || formData.status === "active" ? "bg-background text-foreground" : "bg-black/5 dark:bg-white/5"}`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p className={`text-xs font-black uppercase tracking-widest ${formData.status === "pending" || formData.status === "approved" || formData.status === "active" ? "text-slate-950" : ""}`}>Publish</p>
                  </button>

                  <button 
                    onClick={() => setFormData({ ...formData, status: "draft" })}
                    className={`p-4 rounded-2xl border transition-all text-left space-y-2 ${
                      formData.status === "draft" ? "bg-white border-white" : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-muted-foreground"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.status === "draft" ? "bg-background text-foreground" : "bg-black/5 dark:bg-white/5"}`}>
                      <Info className="w-4 h-4" />
                    </div>
                    <p className={`text-xs font-black uppercase tracking-widest ${formData.status === "draft" ? "text-slate-950" : ""}`}>{t("add.saveDraft")}</p>
                  </button>
                </div>
              </section>

              <GlassCard className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10">
                    <img src={formData.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-foreground font-bold">{formData.price} • {formData.rooms} rooms</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{formData.district}, {formData.address}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Errors */}
        <AnimatePresence>
          {errors.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mt-6">
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <div className="space-y-1">
                  {errors.map((err, i) => (
                    <p key={i} className="text-xs text-red-400 font-medium">{err}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent flex gap-4">
        {currentStepIndex > 0 && (
          <button
            onClick={handlePrev}
            className="flex-1 h-16 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center"
          >
            {t("add.prev")}
          </button>
        )}
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={currentStep === "REVIEW" ? () => finalSubmit() : handleNext}
          disabled={isProcessing}
          className={`flex-[2] h-16 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 ${
            currentStep === "REVIEW" ? "bg-cyan-500 text-slate-950 shadow-cyan-500/20" : "bg-white text-slate-950 shadow-white/5"
          }`}
        >
          {isProcessing ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              {currentStep === "REVIEW" ? t("add.submit") : t("add.next")}
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {isPaymentOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-end justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="w-full max-w-md bg-card rounded-t-[3rem] p-8 space-y-8">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-cyan-500/20">
                  <Star className="w-8 h-8 text-slate-950" />
                </div>
                <h2 className="text-2xl font-black text-foreground">{t("add.paymentTitle")}</h2>
                <p className="text-muted-foreground">{t("add.paymentDesc")}</p>
              </div>

              <div className="bg-black/5 dark:bg-white/5 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-center text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  <span>{t("add.serviceType")}</span>
                  <span className="text-foreground">TOP Listing</span>
                </div>
                <div className="flex justify-between items-center text-2xl font-black text-foreground">
                  <span>{t("add.total")}</span>
                  <span className="text-cyan-400">50,000 UZS</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                    <span>{t("add.benefit1")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                    <span>{t("add.benefit2")}</span>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <div className="space-y-3">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{t("profile.balance")}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "click", name: "Click", logo: "C" },
                      { id: "payme", name: "Payme", logo: "P" },
                      { id: "stripe", name: "Stripe", logo: "S" },
                    ].map((sys) => (
                      <button
                        key={sys.id}
                        onClick={() => setSelectedPayment(sys.id as any)}
                        className={`py-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${
                          selectedPayment === sys.id 
                            ? "bg-cyan-500 border-cyan-500 text-slate-950 font-bold" 
                            : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-muted-foreground"
                        }`}
                      >
                        <span className="text-lg font-black">{sys.logo}</span>
                        <span className="text-[8px] uppercase tracking-tighter">{sys.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setIsPaymentOpen(false)} className="h-14 rounded-2xl border border-black/10 dark:border-white/10 text-foreground font-bold">{t("common.cancel")}</button>
                <button onClick={() => { setIsPaymentOpen(false); processSubmission("active"); }} className="h-14 rounded-2xl bg-cyan-500 text-slate-950 font-black flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {t("add.payNow")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPickerOpen && (
          <LocationPicker
            onClose={() => setIsPickerOpen(false)}
            onSelect={(data) => {
              setFormData({ ...formData, lat: data.lat, lng: data.lng, address: data.address });
              setIsPickerOpen(false);
            }}
            initialLocation={formData.lat && formData.lng ? { lat: formData.lat, lng: formData.lng } : undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
