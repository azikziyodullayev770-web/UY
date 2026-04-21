import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, MapPin, DollarSign, Phone, AlertCircle, Info, Maximize, Bed, Star, CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { useState } from "react";
import { LocationPicker } from "../components/LocationPicker";
import { useProperties } from "../context/PropertyContext";
import { useTranslation } from "../context/LanguageContext";

interface AddListingScreenProps {
  onBack: () => void;
  onSubmit: () => void;
}

export function AddListingScreen({ onBack, onSubmit }: AddListingScreenProps) {
  const { addProperty } = useProperties();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    type: "sale" as "sale" | "rent",
    price: "",
    district: "",
    lat: null as number | null,
    lng: null as number | null,
    address: "",
    description: "",
    phone: "",
    rooms: "",
    size: "",
    isTop: false,
  });

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const districts = [
    "Qarshi", "Shahrisabz", "Kitob", "G'uzor", "Kasbi", 
    "Muborak", "Nishon", "Chiroqchi", "Yakkabog'", "Dehqonobod"
  ];

  const handleInitialSubmit = () => {
    const newErrors: string[] = [];
    if (!formData.district) newErrors.push(t("login.districtRequired"));
    if (!formData.address) newErrors.push(t("login.addressRequired"));
    if (!formData.price) newErrors.push(t("login.priceRequired"));
    if (!formData.phone) newErrors.push(t("login.phoneRequired"));
    
    setErrors(newErrors);
    if (newErrors.length > 0) return;

    if (formData.isTop) {
      setIsPaymentOpen(true);
    } else {
      processSubmission();
    }
  };

  const processSubmission = () => {
    setIsProcessing(true);
    setTimeout(() => {
      addProperty({
        image: "https://images.unsplash.com/photo-1663756915304-40b7eda63e41?w=1080",
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
      });
      setIsProcessing(false);
      onSubmit();
    }, 1500);
  };

  return (
    <div className="flex h-full flex-col bg-slate-950">
      {/* Header */}
      <div className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl px-6 py-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white transition-all active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">{t("add.title")}</h1>
          <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest leading-none">{t("add.subtitle")}</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-40 space-y-8">
        {/* Type Toggle */}
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
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

        {/* TOP Listing Option */}
        <section>
          <button
            onClick={() => setFormData({ ...formData, isTop: !formData.isTop })}
            className={`w-full p-5 rounded-3xl border-2 transition-all text-left relative overflow-hidden group ${
              formData.isTop ? "bg-cyan-500/10 border-cyan-500 shadow-lg shadow-cyan-500/20" : "bg-white/5 border-white/5 hover:border-white/10"
            }`}
          >
            {formData.isTop && (
              <div className="absolute top-0 right-0 p-2">
                <Star className="w-6 h-6 text-cyan-400 fill-current" />
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                formData.isTop ? "bg-cyan-500 text-slate-950" : "bg-white/5 text-slate-400"
              }`}>
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white flex items-center gap-2">
                  {t("add.topTitle")}
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">{t("add.topBadge")}</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">{t("add.topDesc")}</p>
              </div>
            </div>
          </button>
        </section>

        {/* Errors */}
        <AnimatePresence>
          {errors.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <GlassCard className="border-red-500/20 bg-red-500/5 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <div className="space-y-1">
                    {errors.map((err, i) => (
                      <p key={i} className="text-xs text-red-400 font-medium">{err}</p>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* District Selector */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">{t("common.district")}</h3>
          <div className="flex flex-wrap gap-2">
            {districts.map(d => (
              <button
                key={d}
                onClick={() => setFormData({ ...formData, district: d })}
                className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${
                  formData.district === d ? "bg-white text-slate-950 border-white font-bold" : "bg-white/5 border-white/10 text-slate-400"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </section>

        {/* Location Section */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">{t("add.mapLocation")}</h3>
          <button 
            onClick={() => setIsPickerOpen(true)}
            className="w-full flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all text-left group"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${
              formData.address ? "bg-cyan-500 text-slate-950" : "bg-white/5 text-slate-400"
            }`}>
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {formData.address || t("add.mapPlaceholder")}
              </p>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">{t("add.subtitle")}</p>
            </div>
          </button>
        </section>

        {/* Main Details */}
        <section className="space-y-6">
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">{t("add.details")}</h3>
          <div className="space-y-4">
            <div className="relative group">
              <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder={t("add.pricePlaceholder")}
                className="w-full h-16 pl-14 pr-6 rounded-3xl bg-white/5 border border-white/5 text-white font-bold outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600"
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
                  className="w-full h-16 pl-14 pr-6 rounded-3xl bg-white/5 border border-white/5 text-white font-bold outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600"
                />
              </div>
              <div className="relative group">
                <Maximize className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="number"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder={t("add.sizePlaceholder")}
                  className="w-full h-16 pl-14 pr-6 rounded-3xl bg-white/5 border border-white/5 text-white font-bold outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="relative group">
              <Info className="absolute left-5 top-5 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t("add.descPlaceholder")}
                rows={4}
                className="w-full pl-14 pr-6 py-5 rounded-3xl bg-white/5 border border-white/5 text-white font-medium outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600 resize-none"
              />
            </div>

            <div className="relative group">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={t("add.phonePlaceholder")}
                className="w-full h-16 pl-14 pr-6 rounded-3xl bg-white/5 border border-white/5 text-white font-bold outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Floating Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleInitialSubmit}
          disabled={isProcessing}
          className="w-full h-16 rounded-[2rem] bg-white text-slate-950 font-black uppercase tracking-[0.2em] shadow-2xl shadow-white/5 flex items-center justify-center disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : t("add.submit")}
        </motion.button>
      </div>

      {/* Payment Mock Modal */}
      <AnimatePresence>
        {isPaymentOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-end justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="w-full max-w-md bg-slate-900 rounded-t-[3rem] p-8 space-y-8">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-cyan-500/20">
                  <Star className="w-8 h-8 text-slate-950" />
                </div>
                <h2 className="text-2xl font-black text-white">{t("add.paymentTitle")}</h2>
                <p className="text-slate-400">{t("add.paymentDesc")}</p>
              </div>

              <div className="bg-white/5 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-center text-sm font-bold text-slate-400 uppercase tracking-widest">
                  <span>{t("add.serviceType")}</span>
                  <span className="text-white">TOP Listing</span>
                </div>
                <div className="flex justify-between items-center text-2xl font-black text-white">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setIsPaymentOpen(false)} className="h-14 rounded-2xl border border-white/10 text-white font-bold">{t("common.cancel")}</button>
                <button onClick={() => { setIsPaymentOpen(false); processSubmission(); }} className="h-14 rounded-2xl bg-cyan-500 text-slate-950 font-black flex items-center justify-center gap-2">
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

