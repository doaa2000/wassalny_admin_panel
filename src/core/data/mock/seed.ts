import type {
  AdminUser,
  AuditEntry,
  Complaint,
  Coupon,
  Driver,
  DriverApplication,
  Governorate,
  NotificationRecord,
  Passenger,
  PricingPlan,
  Review,
  Trip,
} from '@/core/domain/entities'

/**
 * In-memory seed data. Mirrors the dataset shipped with the source design so
 * the mock data sources behave identically to the reference implementation.
 */

const rawDrivers: Omit<Driver, 'verified' | 'manual' | 'docs'>[] = [
  { id: 'DR-2041', name: { en: 'Ahmed Hassan', ar: 'أحمد حسن' }, phone: '+20 100 234 5671', vt: 'comfort', vnum: 'CAI 4821', city: 'cairo', status: 'active', rating: 4.9, trips: 1284, joined: '2023-03-12' },
  { id: 'DR-2042', name: { en: 'Mohamed Ali', ar: 'محمد علي' }, phone: '+20 101 887 2210', vt: 'economy', vnum: 'GIZ 7745', city: 'giza', status: 'active', rating: 4.7, trips: 932, joined: '2023-06-01' },
  { id: 'DR-2043', name: { en: 'Mahmoud Ibrahim', ar: 'محمود إبراهيم' }, phone: '+20 122 543 1180', vt: 'premium', vnum: 'ALX 1192', city: 'alex', status: 'offline', rating: 4.8, trips: 2104, joined: '2022-11-20' },
  { id: 'DR-2044', name: { en: 'Khaled Saeed', ar: 'خالد سعيد' }, phone: '+20 109 332 0091', vt: 'comfort', vnum: 'CAI 9930', city: 'cairo', status: 'suspended', rating: 3.9, trips: 421, joined: '2024-01-15' },
  { id: 'DR-2045', name: { en: 'Omar Farouk', ar: 'عمر فاروق' }, phone: '+20 111 762 4432', vt: 'van', vnum: 'GIZ 2287', city: 'giza', status: 'active', rating: 4.6, trips: 678, joined: '2023-09-08' },
  { id: 'DR-2046', name: { en: 'Youssef Adel', ar: 'يوسف عادل' }, phone: '+20 128 901 5567', vt: 'economy', vnum: 'MAN 3341', city: 'mansoura', status: 'active', rating: 4.9, trips: 1567, joined: '2022-08-30' },
  { id: 'DR-2047', name: { en: 'Tarek Mostafa', ar: 'طارق مصطفى' }, phone: '+20 100 445 8821', vt: 'premium', vnum: 'ALX 6654', city: 'alex', status: 'offline', rating: 4.5, trips: 843, joined: '2023-12-04' },
  { id: 'DR-2048', name: { en: 'Hossam Nabil', ar: 'حسام نبيل' }, phone: '+20 106 220 3398', vt: 'comfort', vnum: 'ASW 1108', city: 'aswan', status: 'active', rating: 4.8, trips: 1099, joined: '2023-02-19' },
  { id: 'DR-2049', name: { en: 'Amr Diab', ar: 'عمرو دياب' }, phone: '+20 114 553 9921', vt: 'economy', vnum: 'CAI 3377', city: 'cairo', status: 'pending', rating: 0, trips: 0, joined: '2026-06-13' },
  { id: 'DR-2050', name: { en: 'Wael Gomaa', ar: 'وائل جمعة' }, phone: '+20 127 880 1145', vt: 'comfort', vnum: 'GIZ 5512', city: 'giza', status: 'active', rating: 5, trips: 3, joined: '2026-06-11' },
]

export const SEED_DRIVERS: Driver[] = rawDrivers.map((d) => {
  const manual = d.id === 'DR-2049'
  let verified = d.status === 'active' || d.status === 'offline'
  let docs = { nid: 'valid', license: 'valid', vehReg: 'valid', photo: 'valid', vehPhoto: 'valid' } as Driver['docs']
  if (d.status === 'pending') {
    verified = false
    docs = { nid: 'valid', license: 'valid', vehReg: 'pending', photo: 'valid', vehPhoto: 'missing' }
  }
  if (d.status === 'suspended') verified = false
  return { ...d, verified, manual, docs }
})

export const SEED_PASSENGERS: Passenger[] = [
  { id: 'PS-8801', name: { en: 'Sara Mahmoud', ar: 'سارة محمود' }, phone: '+20 102 998 1123', trips: 142, joined: '2023-01-10', status: 'active', city: 'cairo' },
  { id: 'PS-8802', name: { en: 'Nour Ahmed', ar: 'نور أحمد' }, phone: '+20 100 334 7789', trips: 89, joined: '2023-04-22', status: 'active', city: 'giza' },
  { id: 'PS-8803', name: { en: 'Mariam Tarek', ar: 'مريم طارق' }, phone: '+20 122 661 0093', trips: 213, joined: '2022-09-15', status: 'active', city: 'alex' },
  { id: 'PS-8804', name: { en: 'Laila Hassan', ar: 'ليلى حسن' }, phone: '+20 109 887 2231', trips: 34, joined: '2024-02-28', status: 'suspended', city: 'cairo' },
  { id: 'PS-8805', name: { en: 'Hana Sayed', ar: 'هنا سيد' }, phone: '+20 111 443 5567', trips: 178, joined: '2023-07-19', status: 'active', city: 'mansoura' },
  { id: 'PS-8806', name: { en: 'Fatma Adel', ar: 'فاطمة عادل' }, phone: '+20 128 220 9981', trips: 56, joined: '2023-11-03', status: 'inactive', city: 'giza' },
  { id: 'PS-8807', name: { en: 'Aya Khaled', ar: 'آية خالد' }, phone: '+20 106 775 3340', trips: 301, joined: '2022-05-30', status: 'active', city: 'cairo' },
  { id: 'PS-8808', name: { en: 'Dina Samir', ar: 'دينا سمير' }, phone: '+20 100 119 8876', trips: 67, joined: '2023-10-12', status: 'active', city: 'aswan' },
]

export const SEED_TRIPS: Trip[] = [
  { id: 'TR-50291', driver: 0, pass: 0, from: { en: 'Nasr City', ar: 'مدينة نصر' }, to: { en: 'New Cairo', ar: 'القاهرة الجديدة' }, price: 84, date: '2026-06-13 09:24', status: 'completed', city: 'cairo' },
  { id: 'TR-50292', driver: 1, pass: 1, from: { en: 'Dokki', ar: 'الدقي' }, to: { en: 'Mohandessin', ar: 'المهندسين' }, price: 42, date: '2026-06-13 09:41', status: 'started', city: 'giza' },
  { id: 'TR-50293', driver: 2, pass: 2, from: { en: 'Smouha', ar: 'سموحة' }, to: { en: 'Corniche', ar: 'الكورنيش' }, price: 67, date: '2026-06-13 10:02', status: 'accepted', city: 'alex' },
  { id: 'TR-50294', driver: 4, pass: 4, from: { en: 'Mansoura Univ.', ar: 'جامعة المنصورة' }, to: { en: 'Toril', ar: 'توريل' }, price: 38, date: '2026-06-13 10:15', status: 'pending', city: 'mansoura' },
  { id: 'TR-50295', driver: 5, pass: 6, from: { en: 'Maadi', ar: 'المعادي' }, to: { en: 'Downtown', ar: 'وسط البلد' }, price: 95, date: '2026-06-13 08:50', status: 'completed', city: 'cairo' },
  { id: 'TR-50296', driver: 3, pass: 3, from: { en: 'Heliopolis', ar: 'مصر الجديدة' }, to: { en: 'Airport', ar: 'المطار' }, price: 120, date: '2026-06-13 07:30', status: 'cancelled', city: 'cairo' },
  { id: 'TR-50297', driver: 7, pass: 7, from: { en: 'Aswan Station', ar: 'محطة أسوان' }, to: { en: 'Corniche Nile', ar: 'كورنيش النيل' }, price: 55, date: '2026-06-12 21:10', status: 'completed', city: 'aswan' },
  { id: 'TR-50298', driver: 6, pass: 5, from: { en: 'Gleem', ar: 'جليم' }, to: { en: 'Stanley', ar: 'ستانلي' }, price: 48, date: '2026-06-12 20:33', status: 'completed', city: 'alex' },
  { id: 'TR-50299', driver: 0, pass: 2, from: { en: 'Zamalek', ar: 'الزمالك' }, to: { en: 'Garden City', ar: 'جاردن سيتي' }, price: 72, date: '2026-06-12 19:05', status: 'completed', city: 'cairo' },
  { id: 'TR-50300', driver: 1, pass: 0, from: { en: '6th October', ar: 'السادس من أكتوبر' }, to: { en: 'Sheikh Zayed', ar: 'الشيخ زايد' }, price: 60, date: '2026-06-12 18:42', status: 'cancelled', city: 'giza' },
]

export const SEED_COMPLAINTS: Complaint[] = [
  { id: 'CMP-1201', user: { en: 'Sara Mahmoud', ar: 'سارة محمود' }, type: { en: 'Overcharged fare', ar: 'أجرة زائدة' }, status: 'open', priority: 'high' },
  { id: 'CMP-1202', user: { en: 'Mariam Tarek', ar: 'مريم طارق' }, type: { en: 'Driver behavior', ar: 'سلوك السائق' }, status: 'inprogress', priority: 'urgent' },
  { id: 'CMP-1203', user: { en: 'Hana Sayed', ar: 'هنا سيد' }, type: { en: 'Long wait time', ar: 'وقت انتظار طويل' }, status: 'open', priority: 'medium' },
  { id: 'CMP-1204', user: { en: 'Aya Khaled', ar: 'آية خالد' }, type: { en: 'App payment issue', ar: 'مشكلة في الدفع' }, status: 'resolved', priority: 'low' },
  { id: 'CMP-1205', user: { en: 'Dina Samir', ar: 'دينا سمير' }, type: { en: 'Lost item', ar: 'فقدان غرض' }, status: 'open', priority: 'medium' },
  { id: 'CMP-1206', user: { en: 'Nour Ahmed', ar: 'نور أحمد' }, type: { en: 'Wrong route taken', ar: 'مسار خاطئ' }, status: 'closed', priority: 'low' },
]

export const SEED_GOVERNORATES: Governorate[] = [
  { id: 'GV-01', name: { en: 'Cairo', ar: 'القاهرة' }, cities: 12, drivers: 1180, status: 'active' },
  { id: 'GV-02', name: { en: 'Giza', ar: 'الجيزة' }, cities: 9, drivers: 742, status: 'active' },
  { id: 'GV-03', name: { en: 'Alexandria', ar: 'الإسكندرية' }, cities: 7, drivers: 531, status: 'active' },
  { id: 'GV-04', name: { en: 'Dakahlia', ar: 'الدقهلية' }, cities: 6, drivers: 214, status: 'active' },
  { id: 'GV-05', name: { en: 'Aswan', ar: 'أسوان' }, cities: 4, drivers: 98, status: 'inactive' },
  { id: 'GV-06', name: { en: 'Luxor', ar: 'الأقصر' }, cities: 3, drivers: 82, status: 'active' },
]

export const SEED_APPLICATIONS: DriverApplication[] = [
  { id: 'AP-301', name: { en: 'Kareem Fouad', ar: 'كريم فؤاد' }, phone: '+20 100 778 4421', vt: 'comfort', vnum: 'CAI 1184', city: 'cairo', submitted: '2026-06-12', status: 'review', docs: { nid: 'valid', license: 'valid', vehReg: 'valid', photo: 'valid', vehPhoto: 'valid' } },
  { id: 'AP-302', name: { en: 'Sameh Ramy', ar: 'سامح رامي' }, phone: '+20 122 331 9087', vt: 'economy', vnum: 'GIZ 8841', city: 'giza', submitted: '2026-06-12', status: 'review', docs: { nid: 'valid', license: 'valid', vehReg: 'pending', photo: 'valid', vehPhoto: 'valid' } },
  { id: 'AP-303', name: { en: 'Bassem Wael', ar: 'باسم وائل' }, phone: '+20 109 220 5564', vt: 'premium', vnum: 'ALX 2093', city: 'alex', submitted: '2026-06-11', status: 'review', docs: { nid: 'valid', license: 'pending', vehReg: 'valid', photo: 'valid', vehPhoto: 'missing' } },
  { id: 'AP-304', name: { en: 'Islam Gamal', ar: 'إسلام جمال' }, phone: '+20 111 887 6610', vt: 'van', vnum: 'MAN 6614', city: 'mansoura', submitted: '2026-06-11', status: 'review', docs: { nid: 'pending', license: 'valid', vehReg: 'valid', photo: 'valid', vehPhoto: 'valid' } },
  { id: 'AP-305', name: { en: 'Ramy Sobhy', ar: 'رامي صبحي' }, phone: '+20 128 554 2098', vt: 'economy', vnum: 'CAI 7720', city: 'cairo', submitted: '2026-06-10', status: 'review', docs: { nid: 'valid', license: 'valid', vehReg: 'valid', photo: 'valid', vehPhoto: 'valid' } },
  { id: 'AP-306', name: { en: 'Adham Nasser', ar: 'أدهم ناصر' }, phone: '+20 106 110 7732', vt: 'comfort', vnum: 'ASW 9930', city: 'aswan', submitted: '2026-06-10', status: 'review', docs: { nid: 'valid', license: 'valid', vehReg: 'valid', photo: 'valid', vehPhoto: 'missing' } },
]

export const SEED_REVIEWS: Review[] = [
  { id: 'RV-1', by: { en: 'Sara Mahmoud', ar: 'سارة محمود' }, target: { en: 'Ahmed Hassan', ar: 'أحمد حسن' }, role: 'driver', rating: 5, text: { en: 'Very polite driver and clean car. Smooth ride!', ar: 'سائق مهذب جدًا وسيارة نظيفة. رحلة ممتازة!' }, date: '2026-06-12', flagged: false },
  { id: 'RV-2', by: { en: 'Mariam Tarek', ar: 'مريم طارق' }, target: { en: 'Khaled Saeed', ar: 'خالد سعيد' }, role: 'driver', rating: 2, text: { en: 'Took a longer route and was rude.', ar: 'سلك طريقًا أطول وكان غير مهذب.' }, date: '2026-06-12', flagged: true },
  { id: 'RV-3', by: { en: 'Omar Farouk', ar: 'عمر فاروق' }, target: { en: 'Aya Khaled', ar: 'آية خالد' }, role: 'passenger', rating: 5, text: { en: 'On time and friendly passenger.', ar: 'راكبة في الموعد ولطيفة.' }, date: '2026-06-11', flagged: false },
  { id: 'RV-4', by: { en: 'Hana Sayed', ar: 'هنا سيد' }, target: { en: 'Youssef Adel', ar: 'يوسف عادل' }, role: 'driver', rating: 4, text: { en: 'Good experience overall, recommended.', ar: 'تجربة جيدة بشكل عام، أنصح به.' }, date: '2026-06-11', flagged: false },
  { id: 'RV-5', by: { en: 'Dina Samir', ar: 'دينا سمير' }, target: { en: 'Mahmoud Ibrahim', ar: 'محمود إبراهيم' }, role: 'driver', rating: 1, text: { en: 'Cancelled at the last minute, bad attitude.', ar: 'ألغى في آخر لحظة، تعامل سيئ.' }, date: '2026-06-10', flagged: true },
  { id: 'RV-6', by: { en: 'Nour Ahmed', ar: 'نور أحمد' }, target: { en: 'Hossam Nabil', ar: 'حسام نبيل' }, role: 'driver', rating: 5, text: { en: 'Excellent service, very professional.', ar: 'خدمة ممتازة واحترافية عالية.' }, date: '2026-06-10', flagged: false },
]

export const SEED_COUPONS: Coupon[] = [
  { id: 'CP-1', code: 'WASALNY25', type: 'percent', value: 25, used: 1842, limit: 5000, exp: '2026-07-31', status: 'active' },
  { id: 'CP-2', code: 'RIDE10', type: 'fixed', value: 10, used: 920, limit: 2000, exp: '2026-06-30', status: 'active' },
  { id: 'CP-3', code: 'WELCOME50', type: 'percent', value: 50, used: 4980, limit: 5000, exp: '2026-06-15', status: 'active' },
  { id: 'CP-4', code: 'EID20', type: 'percent', value: 20, used: 3120, limit: 3000, exp: '2026-04-20', status: 'closed' },
  { id: 'CP-5', code: 'NIGHT15', type: 'fixed', value: 15, used: 540, limit: 1500, exp: '2026-08-10', status: 'active' },
]

export const SEED_ADMINS: AdminUser[] = [
  { id: 'AD-1', name: { en: 'Omar Adel', ar: 'عمر عادل' }, email: 'omar@wasalny.eg', role: 'super', status: 'active', last: 'Now' },
  { id: 'AD-2', name: { en: 'Yasmine Saad', ar: 'ياسمين سعد' }, email: 'yasmine@wasalny.eg', role: 'ops', status: 'active', last: '2h ago' },
  { id: 'AD-3', name: { en: 'Hossam Lotfy', ar: 'حسام لطفي' }, email: 'hossam@wasalny.eg', role: 'support', status: 'active', last: '5h ago' },
  { id: 'AD-4', name: { en: 'Nada Refaat', ar: 'ندى رفعت' }, email: 'nada@wasalny.eg', role: 'finance', status: 'active', last: '1d ago' },
  { id: 'AD-5', name: { en: 'Tamer Wahba', ar: 'تامر وهبة' }, email: 'tamer@wasalny.eg', role: 'support', status: 'inactive', last: '2w ago' },
]

export const SEED_AUDIT: AuditEntry[] = [
  { admin: { en: 'Omar Adel', ar: 'عمر عادل' }, action: { en: 'Approved driver application', ar: 'قبول طلب سائق' }, target: 'AP-298', date: '2026-06-13', time: '09:42' },
  { admin: { en: 'Yasmine Saad', ar: 'ياسمين سعد' }, action: { en: 'Updated base fare', ar: 'تحديث الأجرة الأساسية' }, target: 'Pricing', date: '2026-06-13', time: '09:18' },
  { admin: { en: 'Nada Refaat', ar: 'ندى رفعت' }, action: { en: 'Processed driver payout', ar: 'صرف مستحقات السائقين' }, target: 'PAY-1182', date: '2026-06-13', time: '08:55' },
  { admin: { en: 'Hossam Lotfy', ar: 'حسام لطفي' }, action: { en: 'Resolved complaint', ar: 'حل شكوى' }, target: 'CMP-1204', date: '2026-06-12', time: '21:30' },
  { admin: { en: 'Omar Adel', ar: 'عمر عادل' }, action: { en: 'Suspended driver', ar: 'إيقاف سائق' }, target: 'DR-2044', date: '2026-06-12', time: '18:12' },
  { admin: { en: 'Yasmine Saad', ar: 'ياسمين سعد' }, action: { en: 'Created coupon', ar: 'إنشاء كوبون' }, target: 'NIGHT15', date: '2026-06-12', time: '15:40' },
  { admin: { en: 'Tamer Wahba', ar: 'تامر وهبة' }, action: { en: 'Sent push notification', ar: 'إرسال إشعار' }, target: 'NOTIF-77', date: '2026-06-11', time: '12:05' },
  { admin: { en: 'Nada Refaat', ar: 'ندى رفعت' }, action: { en: 'Exported revenue report', ar: 'تصدير تقرير الإيرادات' }, target: 'Reports', date: '2026-06-11', time: '10:22' },
]

export const SEED_NOTIFICATIONS: NotificationRecord[] = [
  { title: { en: 'Eid discount is live!', ar: 'خصم العيد متاح الآن!' }, target: 'all', sent: '2026-06-12 10:00', reach: 48210, opened: 62 },
  { title: { en: 'Complete your profile', ar: 'أكمل ملفك الشخصي' }, target: 'drivers', sent: '2026-06-10 14:30', reach: 2847, opened: 74 },
  { title: { en: 'Rate your last trip', ar: 'قيّم رحلتك الأخيرة' }, target: 'passengers', sent: '2026-06-09 19:00', reach: 12400, opened: 55 },
  { title: { en: 'Scheduled maintenance', ar: 'صيانة مجدولة' }, target: 'all', sent: '2026-06-07 02:00', reach: 51057, opened: 41 },
]

export const SEED_PRICING: PricingPlan[] = [
  { vt: 'economy', base: 15, km: 4.5, min: 0.5, service: 3, minp: 20 },
  { vt: 'comfort', base: 22, km: 6.0, min: 0.8, service: 5, minp: 30 },
  { vt: 'premium', base: 35, km: 9.5, min: 1.2, service: 8, minp: 50 },
  { vt: 'van', base: 40, km: 11.0, min: 1.5, service: 10, minp: 60 },
]

export const SEED_DASHBOARD_STATS = [
  { key: 'totalDrivers', value: '2,847', delta: '6.2%', up: true, icon: 'drivers', palette: 'orange' },
  { key: 'activeDrivers', value: '1,932', delta: '3.1%', up: true, icon: 'car', palette: 'green' },
  { key: 'totalPassengers', value: '48,210', delta: '12.4%', up: true, icon: 'passengers', palette: 'indigo' },
  { key: 'tripsToday', value: '3,156', delta: '8.7%', up: true, icon: 'trips', palette: 'blue' },
  { key: 'tripsMonth', value: '89,432', delta: '4.5%', up: true, icon: 'trending', palette: 'violet' },
  { key: 'totalRevenue', value: 'EGP 4.82M', delta: '9.3%', up: true, icon: 'wallet', palette: 'teal' },
  { key: 'todayRevenue', value: 'EGP 168K', delta: '5.1%', up: true, icon: 'earnings', palette: 'green' },
  { key: 'cancelled', value: '214', delta: '2.4%', up: false, icon: 'xCircle', palette: 'red' },
]
