        let userData = {
            nama: "Pengguna",
            nomor: "",
            email: ""
        };

        // Akun yang berhasil login pertama kali mendapat akses Admin Panel.
        let firstLoginCompleted = false;
        let isAdmin = false;

        let dataKeuangan = {
            saldoUtama: 0,
            totalInvestasi: 0,
            totalImbal: 0
        };

        let currentDeposit = 50000;
        let currentTarik = 0;

        function formatRupiah(angka) {
            return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }

        function updateUI() {
            document.getElementById('saldo-utama').innerText = formatRupiah(dataKeuangan.saldoUtama);
            document.getElementById('total-investasi').innerText = formatRupiah(dataKeuangan.totalInvestasi);
            
            let persentase = dataKeuangan.totalInvestasi > 0 ? ((dataKeuangan.totalImbal / dataKeuangan.totalInvestasi) * 100).toFixed(2) : "0,00";
            document.getElementById('total-imbal').innerText = `+${formatRupiah(dataKeuangan.totalImbal)} (${persentase}%)`;
            
            document.getElementById('nilai-portofolio').innerText = formatRupiah(dataKeuangan.totalInvestasi);
            document.getElementById('portofolio-imbal').innerText = `+${formatRupiah(dataKeuangan.totalImbal)} (${persentase}%)`;
            
            document.getElementById('tarik-saldo-tersedia').innerText = formatRupiah(dataKeuangan.saldoUtama);
            
            // Perbarui nama di UI
            document.getElementById('greeting-nama').innerText = `Halo, ${userData.nama.split(' ')[0]} 👋`;
            document.querySelectorAll('.profile-nama').forEach(el => el.innerText = userData.nama);
            document.querySelectorAll('.profile-email').forEach(el => el.innerText = userData.email);
            
            // Buat inisial nama untuk avatar
            let initials = userData.nama.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "U";
            document.querySelectorAll('.profile-initials').forEach(el => el.innerText = initials);

            const roleEl = document.getElementById('profil-role');
            if (roleEl) roleEl.innerText = isAdmin ? 'Administrator' : 'Pengguna';

            const adminCard = document.getElementById('admin-panel-card');
            if (adminCard) adminCard.classList.toggle('hidden', !isAdmin);

            const adminUser = document.getElementById('admin-current-user');
            if (adminUser) adminUser.innerText = userData.nama || 'Administrator';

            const adminSaldo = document.getElementById('admin-saldo-sistem');
            if (adminSaldo) adminSaldo.innerText = formatRupiah(dataKeuangan.saldoUtama);

            const adminInvestasi = document.getElementById('admin-investasi-aktif');
            if (adminInvestasi) adminInvestasi.innerText = formatRupiah(dataKeuangan.totalInvestasi);

            const adminImbal = document.getElementById('admin-total-imbal');
            if (adminImbal) adminImbal.innerText = formatRupiah(dataKeuangan.totalImbal);
        }

        // Proses Login
        function prosesLogin() {
            let identifier = document.getElementById('login-identifier').value.trim();
            let password = document.getElementById('login-password').value;

            if (!identifier || !password) {
                alert("Mohon masukkan email dan password!");
                return;
            }

            // Gunakan identitas login untuk mengisi profil ketika belum ada data terdaftar.
            if (!userData.nomor && !userData.email) {
                if (identifier.includes('@')) {
                    userData.email = identifier;
                    userData.nama = identifier.split('@')[0] || "Pengguna";
                } else {
                    userData.nomor = identifier;
                    userData.nama = "Pengguna";
                    userData.email = identifier + "@mail.com";
                }
            }

            // Hanya login pertama yang memperoleh hak administrator.
            if (!firstLoginCompleted) {
                isAdmin = true;
                firstLoginCompleted = true;
                alert("Login berhasil. Akun login pertama ditetapkan sebagai Administrator.");
            } else {
                isAdmin = false;
                alert("Login berhasil. Selamat datang kembali.");
            }

            updateUI();
            switchTab('beranda');
        }

        function prosesLogout() {
            isAdmin = false;
            userData = { nama: "Pengguna", nomor: "", email: "" };
            updateUI();
            switchTab('login');
        }

        // Proses Pendaftaran (Daftar)
        function prosesDaftar() {
            let nama = document.getElementById('daftar-nama').value;
            let nomor = document.getElementById('daftar-nomor').value;
            let password = document.getElementById('daftar-password').value;
            let konfirmasi = document.getElementById('daftar-konfirmasi').value;

            if (!nama || !nomor || !password || !konfirmasi) {
                alert("Semua kolom (Nama, Email, Password, Konfirmasi Password) wajib diisi!");
                return;
            }

            if (password !== konfirmasi) {
                alert("Password dan Konfirmasi Password tidak cocok!");
                return;
            }

            // Simpan data pengguna baru
            userData.nama = nama;
            userData.nomor = nomor;
            userData.email = nomor.includes('@') ? nomor : nomor + '@mail.com';

            updateUI();
            alert("Registrasi berhasil! Silakan masuk menggunakan akun baru Anda.");
            switchTab('login');
        }

        // Interaksi Deposit
        function pilihDeposit(nominal, el) {
            currentDeposit = nominal;
            document.querySelectorAll('.deposit-btn').forEach(btn => {
                btn.className = "deposit-btn bg-white text-slate-700 border border-slate-200 p-3 rounded-xl font-bold text-xs shadow-sm transition hover:bg-slate-50";
            });
            el.className = "deposit-btn bg-blue-600 text-white p-3 rounded-xl font-bold text-xs shadow-sm transition";
            
            document.getElementById('display-deposit-nominal').innerText = formatRupiah(nominal);
            document.getElementById('footer-deposit-total').innerText = formatRupiah(nominal);
        }

        function prosesDeposit() {
            dataKeuangan.saldoUtama += currentDeposit;
            updateUI();
            switchTab('beranda');
            alert(`Deposit sebesar ${formatRupiah(currentDeposit)} berhasil! Saldo Utama Anda telah bertambah.`);
        }

        // Interaksi Tarik Saldo
        function pilihTarik(nominal, el) {
            if (nominal > dataKeuangan.saldoUtama) {
                alert("Saldo Utama Anda tidak mencukupi untuk penarikan ini.");
                return;
            }
            currentTarik = nominal;
            highlightTarikBtn(el);
            updateTarikRincian();
        }

        function pilihTarikMax(el) {
            if (dataKeuangan.saldoUtama <= 0) {
                alert("Saldo Utama Anda masih Rp 0.");
                return;
            }
            currentTarik = dataKeuangan.saldoUtama;
            highlightTarikBtn(el);
            updateTarikRincian();
        }

        function highlightTarikBtn(el) {
            document.querySelectorAll('.tarik-btn').forEach(btn => {
                btn.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
                btn.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
            });
            el.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');
            el.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
        }

        function updateTarikRincian() {
            let pajak = Math.floor(currentTarik * 0.10);
            let totalDiterima = currentTarik - pajak;

            document.getElementById('display-tarik-nominal').innerText = formatRupiah(currentTarik);
            document.getElementById('rincian-nominal').innerText = formatRupiah(currentTarik);
            document.getElementById('rincian-pajak').innerText = "-" + formatRupiah(pajak);
            document.getElementById('rincian-total').innerText = formatRupiah(totalDiterima);
            document.getElementById('footer-tarik-total').innerText = formatRupiah(totalDiterima);

            const btnTarikAksi = document.getElementById('btn-tarik-aksi');
            if (currentTarik > 0) {
                btnTarikAksi.innerText = "Tarik Saldo";
                btnTarikAksi.className = "bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-blue-700 transition shadow cursor-pointer";
            } else {
                btnTarikAksi.innerText = "Masukkan nominal";
                btnTarikAksi.className = "bg-slate-300 text-slate-600 font-bold text-xs px-6 py-2.5 rounded-xl cursor-not-allowed transition shadow";
            }
        }

        function prosesTarik() {
            let jenisBank = document.getElementById('tarik-jenis-bank').value;
            let noRekening = document.getElementById('tarik-no-rekening').value;
            let namaRekening = document.getElementById('tarik-nama-rekening').value;

            if (!noRekening || !namaRekening) {
                alert("Mohon isi nomor rekening/e-wallet dan nama pemilik dengan lengkap!");
                return;
            }

            if (currentTarik <= 0 || currentTarik > dataKeuangan.saldoUtama) return;
            dataKeuangan.saldoUtama -= currentTarik;
            updateUI();
            
            document.getElementById('profil-bank-terhubung').innerText = `${jenisBank} (${noRekening})`;

            alert(`Penarikan sebesar ${formatRupiah(currentTarik)} berhasil diproses ke ${jenisBank} - ${noRekening} (${namaRekening}).`);
            switchTab('beranda');
            currentTarik = 0;
            updateTarikRincian();
        }

        // Simulasi Investasi dari Paket
        function simulasiInvestasi(namaPaket, nominal) {
            if (dataKeuangan.saldoUtama < nominal) {
                alert("Saldo Utama Anda tidak cukup! Silakan lakukan Deposit terlebih dahulu.");
                switchTab('deposit');
                return;
            }
            dataKeuangan.saldoUtama -= nominal;
            dataKeuangan.totalInvestasi += nominal;
            dataKeuangan.totalImbal += Math.floor(nominal * 0.015);
            updateUI();
            switchTab('beranda');
            alert(`Berhasil memilih ${namaPaket} (${formatRupiah(nominal)})! Saldo portofolio aktif.`);
        }

        function removeFromWatchlist(el, namaItem) {
            const card = el.closest('.bg-white');
            if (card) {
                card.remove();
                alert(`${namaItem} telah dihapus dari Watchlist.`);
            }
        }


        function adminAction(label) {
            alert(`${label}: fitur admin siap dikembangkan.`);
        }

        // Popup pengumuman
        let promoPopupShown = false;

        function showPromoPopup() {
            if (promoPopupShown) return;
            const popup = document.getElementById('promo-popup');
            if (!popup) return;
            popup.classList.add('show');
            promoPopupShown = true;
            document.body.style.overflow = 'hidden';
        }

        function closePromoPopup() {
            const popup = document.getElementById('promo-popup');
            if (!popup) return;
            popup.classList.remove('show');
            document.body.style.overflow = '';
        }

        document.getElementById('promo-popup')?.addEventListener('click', function(e) {
            if (e.target === this) closePromoPopup();
        });

        function switchTab(tabName) {
            const views = {
                'login': document.getElementById('view-login'),
                'daftar': document.getElementById('view-daftar'),
                'beranda': document.getElementById('view-beranda'),
                'deposit': document.getElementById('view-deposit'),
                'tarik': document.getElementById('view-tarik'),
                'investasi': document.getElementById('view-investasi'),
                'watchlist': document.getElementById('view-watchlist'),
                'akun': document.getElementById('view-profil'),
                'referral': document.getElementById('view-referral'),
                'admin': document.getElementById('view-admin')
            };

            for (let key in views) {
                if (views[key]) views[key].classList.add('hidden');
            }

            if (tabName === 'admin' && !isAdmin) {
                alert("Akses Admin Panel hanya tersedia untuk akun yang login pertama.");
                views['akun'].classList.remove('hidden');
                tabName = 'akun';
            } else if (views[tabName]) {
                views[tabName].classList.remove('hidden');
            } else {
                views['login'].classList.remove('hidden');
            }

            // Tampilkan popup setelah masuk ke dashboard.
            if (tabName === 'beranda') {
                setTimeout(showPromoPopup, 180);
            }

            // Sembunyikan/Tampilkan Bottom Navbar berdasarkan halaman
            const bottomNav = document.getElementById('bottom-nav-container');
            if (tabName === 'login' || tabName === 'daftar') {
                bottomNav.classList.add('hidden');
            } else {
                bottomNav.classList.remove('hidden');
            }
        }

        let isHidden = false;
        function toggleSaldo(el) {
            const saldoEl = document.getElementById('saldo-utama');
            if (isHidden) {
                saldoEl.innerText = formatRupiah(dataKeuangan.saldoUtama);
                el.classList.remove('fa-eye-slash');
                el.classList.add('fa-eye');
                isHidden = false;
            } else {
                saldoEl.innerText = "Rp ••••••••••";
                el.classList.remove('fa-eye');
                el.classList.add('fa-eye-slash');
                isHidden = true;
            }
        }


    
/* =========================================================
   MULTI USER + ADMIN APPROVAL + AVATAR + DEPOSIT QRIS
   Data demo disimpan terpisah per browser melalui localStorage.
   ========================================================= */
const LEGACY_UPDATE_UI = updateUI;
const USER_DB_KEY = 'demo_multi_users_v3';
const ACTIVE_USER_KEY = 'demo_active_user_v3';

function loadUsersDB(){
    try { return JSON.parse(localStorage.getItem(USER_DB_KEY) || '[]'); }
    catch(e){ return []; }
}
function saveUsersDB(users){ localStorage.setItem(USER_DB_KEY, JSON.stringify(users)); }
function getActiveUser(){
    const id=localStorage.getItem(ACTIVE_USER_KEY);
    return loadUsersDB().find(u=>u.id===id) || null;
}
function rememberActiveSession(u){
    if(u && u.id) localStorage.setItem(ACTIVE_USER_KEY,u.id);
}

function saveActiveUser(){
    const users=loadUsersDB();
    const idx=users.findIndex(u=>u.id===userData.id);
    if(idx>=0){ users[idx]=Object.assign(users[idx], userData, {keuangan:dataKeuangan}); saveUsersDB(users); }
}
const APK_URL_KEY='surya_inves_apk_url_v1';
function generateReferralCode(nama){
    const prefix=String(nama||'USER').replace(/[^a-z0-9]/gi,'').toUpperCase().slice(0,4)||'USER';
    return 'SV-'+prefix+'-'+Math.random().toString(36).slice(2,7).toUpperCase();
}
function getReferralCode(){
    if(!userData.referralCode){userData.referralCode=generateReferralCode(userData.nama);persistCurrentUser();}
    return userData.referralCode;
}
function getReferralLink(){
    const base=(location.href||'').split('#')[0].split('?')[0];
    return base+'?ref='+encodeURIComponent(getReferralCode());
}
function getApkUrl(){return localStorage.getItem(APK_URL_KEY)||'';}
function unduhAPK(){
    const url=getApkUrl();
    if(!url){alert('Link APK belum diatur admin.');return;}
    try{ const u=new URL(url); if(!/^https?:$/.test(u.protocol)) throw new Error('bad'); window.location.href=u.href; }catch(e){alert('Link APK admin tidak valid.');}
}
function saveApkUrl(){
    if(!isAdmin)return;
    const input=document.getElementById('admin-apk-url');
    const url=(input?.value||'').trim();
    if(!url){alert('Masukkan link APK terlebih dahulu.');return;}
    try{const u=new URL(url); if(!/^https?:$/.test(u.protocol)) throw new Error('bad'); localStorage.setItem(APK_URL_KEY,u.href); alert('Link APK berhasil disimpan.'); renderAdminPanel();}catch(e){alert('Masukkan URL http/https yang valid.');}
}
function updateReferralUI(){
    const code=getReferralCode();
    const link=getReferralLink();
    const r=getActiveUser()||userData;
    const users=loadUsersDB();
    const refUsers=users.filter(u=>u.referredBy===userData.id);
    const approved=refUsers.reduce((n,u)=>n+(u.transactions||[]).filter(t=>t.type==='deposit'&&t.status==='approved').length,0);
    const commission=Number(r.referralCommission||0);
    document.getElementById('referral-code')?.replaceChildren(document.createTextNode(code));
    const linkEl=document.getElementById('referral-link'); if(linkEl) linkEl.value=link;
    const cEl=document.getElementById('referral-commission'); if(cEl)cEl.innerText=money(commission);
    const tEl=document.getElementById('referral-total'); if(tEl)tEl.innerText=String(refUsers.length);
    const aEl=document.getElementById('referral-approved-deposit'); if(aEl)aEl.innerText=String(approved);
}
function copyReferralLink(){
    const el=document.getElementById('referral-link'); if(!el)return;
    navigator.clipboard?.writeText(el.value).then(()=>alert('Link referral berhasil disalin.')).catch(()=>{el.select();document.execCommand('copy');alert('Link referral berhasil disalin.');});
}
function applyReferralFromUrl(){
    const code=new URLSearchParams(location.search).get('ref');
    if(!code||!userData.id)return;
    const users=loadUsersDB(); const me=users.find(u=>u.id===userData.id); if(!me||me.referredBy)return;
    const ref=users.find(u=>u.referralCode===code && u.id!==me.id);
    if(ref){me.referredBy=ref.id; saveUsersDB(users); userData.referredBy=ref.id;}
}

function makeUser(nama, identifier, password, isAdmin=false){
    const clean=(identifier||'').trim().toLowerCase();
    const u={
        id:'u_'+Date.now()+'_'+Math.random().toString(36).slice(2,7),
        nama:nama||'Pengguna',
        nomor:identifier||'',
        email:clean.includes('@')?clean:(identifier||'')+'@mail.com',
        password:password||'',
        isAdmin:!!isAdmin,
        avatar:'',
        referralCode:'',
        referredBy:null,
        referralCommission:0,
        referralStats:{users:0, approvedDeposits:0},
        bank:'Belum terhubung',
        keuangan:{saldoUtama:0,totalInvestasi:0,totalImbal:0},
        transactions:[]
    };
    return u;
}
function loadActiveUserIntoUI(u){
    userData=Object.assign({},u);
    dataKeuangan=Object.assign({saldoUtama:0,totalInvestasi:0,totalImbal:0},u.keuangan||{});
    isAdmin=!!u.isAdmin;
    rememberActiveSession(u);
}
function persistCurrentUser(){
    if(!userData.id) return;
    userData.keuangan=Object.assign({},dataKeuangan);
    saveActiveUser();
}
function money(n){ return formatRupiah(Math.max(0,Number(n)||0)); }

function updateUI(){
    // Jalankan UI lama untuk bagian yang tetap kompatibel
    try { LEGACY_UPDATE_UI(); } catch(e) {}
    const active=getActiveUser();
    const avatar=active?.avatar || userData.avatar || '';
    document.querySelectorAll('.user-avatar-img').forEach(img=>{
        img.src=avatar;
        img.style.display=avatar?'block':'none';
    });
    document.querySelectorAll('.profile-initials').forEach(el=>{
        el.style.display=avatar?'none':'flex';
    });
    const adminCard=document.getElementById('admin-panel-card');
    if(adminCard) adminCard.classList.toggle('hidden',!isAdmin);
    const bankEl=document.getElementById('profil-bank-terhubung');
    if(bankEl) bankEl.innerText=userData.bank||'Belum terhubung';
    if(document.getElementById('admin-current-user')) document.getElementById('admin-current-user').innerText=userData.nama||'Administrator';
    renderAdminPanel();
    updateReferralUI();
}

function prosesLogin(){
    const identifier=document.getElementById('login-identifier').value.trim();
    const password=document.getElementById('login-password').value;
    if(!identifier||!password){ alert('Mohon masukkan email dan password!'); return; }

    let users=loadUsersDB();
    let u=users.find(x=>x.nomor.toLowerCase()===identifier.toLowerCase() || x.email.toLowerCase()===identifier.toLowerCase());
    if(!u){
        if(users.length===0){
            // Akun yang berhasil login pertama kali menjadi administrator.
            u=makeUser(identifier.includes('@')?identifier.split('@')[0]:'Administrator',identifier,password,true);
            u.referralCode=generateReferralCode(u.nama);
            users.push(u); saveUsersDB(users);
        } else {
            alert('Akun belum terdaftar. Silakan pilih Daftar Sekarang terlebih dahulu.');
            return;
        }
    } else if(u.password && u.password!==password){
        alert('Password salah.');
        return;
    }
    loadActiveUserIntoUI(u);
    applyReferralFromUrl();
    updateUI();
    alert(u.isAdmin?'Login berhasil. Akun pertama memiliki akses Admin Panel.':'Login berhasil. Selamat datang kembali.');
    switchTab('beranda');
}

function prosesDaftar(){
    const nama=document.getElementById('daftar-nama').value.trim();
    const nomor=document.getElementById('daftar-nomor').value.trim();
    const password=document.getElementById('daftar-password').value;
    const konfirmasi=document.getElementById('daftar-konfirmasi').value;
    if(!nama||!nomor||!password||!konfirmasi){alert('Semua kolom wajib diisi!');return;}
    if(password!==konfirmasi){alert('Password dan Konfirmasi Password tidak cocok!');return;}
    let users=loadUsersDB();
    if(users.some(x=>x.nomor.toLowerCase()===nomor.toLowerCase() || x.email.toLowerCase()===nomor.toLowerCase())){
        alert('Nomor/email sudah terdaftar.'); return;
    }
    const u=makeUser(nama,nomor,password,users.length===0);
    u.referralCode=generateReferralCode(nama);
    const refCode=new URLSearchParams(location.search).get('ref');
    const referrer=refCode?users.find(x=>x.referralCode===refCode && x.id!==u.id):null;
    if(referrer) u.referredBy=referrer.id;
    users.push(u); saveUsersDB(users);
    document.getElementById('login-identifier').value=nomor;
    document.getElementById('login-password').value=password;
    alert(u.isAdmin?'Akun pertama berhasil dibuat sebagai Administrator.':'Registrasi berhasil. Silakan masuk.');
    switchTab('login');
}

function prosesLogout(){
    persistCurrentUser();
    isAdmin=false;
    userData={nama:'Pengguna',nomor:'',email:'',id:''};
    dataKeuangan={saldoUtama:0,totalInvestasi:0,totalImbal:0};
    localStorage.removeItem(ACTIVE_USER_KEY);
    switchTab('daftar');
}

function gantiAvatar(event){
    const file=event.target.files?.[0];
    if(!file) return;
    if(!file.type.startsWith('image/')){alert('Pilih file foto/gambar.');return;}
    const reader=new FileReader();
    reader.onload=()=>{
        userData.avatar=reader.result;
        persistCurrentUser();
        updateUI();
        alert('Foto profil berhasil diperbarui.');
    };
    reader.readAsDataURL(file);
}

/* Deposit: tidak langsung menambah saldo. Buat permintaan pending. */
function prosesDeposit(){
    if(!userData.id){alert('Silakan login terlebih dahulu.');return;}
    document.getElementById('payment-deposit-nominal').innerText=money(currentDeposit);
    document.getElementById('deposit-payment-modal').classList.add('show');
    document.body.style.overflow='hidden';
}
function closeDepositPayment(){
    document.getElementById('deposit-payment-modal').classList.remove('show');
    if(!document.getElementById('promo-popup')?.classList.contains('show')) document.body.style.overflow='';
}
function konfirmasiSudahBayar(){
    let users=loadUsersDB();
    const idx=users.findIndex(u=>u.id===userData.id);
    if(idx<0)return;
    users[idx].transactions=users[idx].transactions||[];
    users[idx].transactions.unshift({
        id:'dep_'+Date.now(),
        type:'deposit', amount:Number(currentDeposit), status:'pending',
        time:new Date().toLocaleString('id-ID')
    });
    saveUsersDB(users);
    userData.transactions=users[idx].transactions;
    closeDepositPayment();
    showStatusModal(`Deposit ${money(currentDeposit)} sudah dicatat dan sedang menunggu persetujuan admin.`);
    updateUI();
}
function showStatusModal(msg){
    document.getElementById('status-modal-text').innerText=msg;
    document.getElementById('status-modal').classList.add('show');
    document.body.style.overflow='hidden';
}
function closeStatusModal(){
    document.getElementById('status-modal').classList.remove('show');
    if(!document.getElementById('deposit-payment-modal')?.classList.contains('show')) document.body.style.overflow='';
}

/* Penarikan: permintaan dibuat pending; saldo dikurangi saat admin approve. */
function prosesTarik(){
    const jenisBank=document.getElementById('tarik-jenis-bank').value;
    const noRekening=document.getElementById('tarik-no-rekening').value.trim();
    const namaRekening=document.getElementById('tarik-nama-rekening').value.trim();
    if(!noRekening||!namaRekening){alert('Mohon isi nomor rekening/e-wallet dan nama pemilik dengan lengkap!');return;}
    if(currentTarik<=0||currentTarik>dataKeuangan.saldoUtama){alert('Saldo tidak mencukupi atau nominal belum dipilih.');return;}
    const users=loadUsersDB(), idx=users.findIndex(u=>u.id===userData.id);
    if(idx<0)return;
    users[idx].bank=`${jenisBank} (${noRekening})`;
    users[idx].transactions=users[idx].transactions||[];
    users[idx].transactions.unshift({
        id:'wd_'+Date.now(), type:'withdraw', amount:Number(currentTarik),
        net:Number(currentTarik)-Math.floor(Number(currentTarik)*.10),
        status:'pending', bank:jenisBank, account:noRekening, accountName:namaRekening,
        time:new Date().toLocaleString('id-ID')
    });
    saveUsersDB(users);
    userData.bank=users[idx].bank; userData.transactions=users[idx].transactions;
    const amount=currentTarik;
    currentTarik=0; updateTarikRincian(); updateUI();
    showStatusModal(`Penarikan ${money(amount)} sudah dikirim dan menunggu persetujuan admin.`);
}

/* Admin */
function renderAdminPanel(){
    if(!isAdmin)return;
    const users=loadUsersDB();
    const allTx=users.flatMap(u=>(u.transactions||[]).map(t=>Object.assign({},t,{userId:u.id,userName:u.nama})));
    const pendingDep=allTx.filter(t=>t.type==='deposit'&&t.status==='pending');
    const pendingWd=allTx.filter(t=>t.type==='withdraw'&&t.status==='pending');
    const saldo=users.reduce((s,u)=>s+Number(u.keuangan?.saldoUtama||0),0);
    const set=(id,val)=>{const el=document.getElementById(id);if(el)el.innerText=val;};
    set('admin-total-pengguna',users.length); set('admin-saldo-sistem',money(saldo));
    const apk=document.getElementById('admin-apk-url'); if(apk) apk.value=getApkUrl();
    set('admin-pending-deposit',pendingDep.length); set('admin-pending-tarik',pendingWd.length);
    const txBox=document.getElementById('admin-transactions');
    if(txBox){
        const pending=[...pendingDep,...pendingWd].sort((a,b)=>a.id.localeCompare(b.id));
        txBox.innerHTML=pending.length?pending.map(t=>`
          <div class="admin-tx-card">
            <div class="flex justify-between gap-2">
              <div><p class="text-xs font-bold text-slate-800">${escapeHtml(t.userName)}</p>
              <p class="text-[10px] text-slate-500">${t.type==='deposit'?'Deposit':'Penarikan'} • ${escapeHtml(t.time||'')}</p></div>
              <span class="approval-badge status-pending">MENUNGGU</span>
            </div>
            <p class="text-sm font-extrabold text-blue-700 mt-2">${money(t.amount)}</p>
            ${t.type==='withdraw'?`<p class="text-[10px] text-slate-500 mt-1">${escapeHtml(t.bank||'')} • ${escapeHtml(t.account||'')} • ${escapeHtml(t.accountName||'')}</p>`:''}
            <div class="grid grid-cols-2 gap-2 mt-3">
              <button onclick="approveTransaction('${t.userId}','${t.id}')" class="bg-emerald-600 text-white text-[10px] font-bold py-2 rounded-lg">Setujui</button>
              <button onclick="rejectTransaction('${t.userId}','${t.id}')" class="bg-red-50 text-red-600 text-[10px] font-bold py-2 rounded-lg border border-red-100">Tolak</button>
            </div>
          </div>`).join(''):'<div class="text-center text-xs text-slate-400 py-5">Tidak ada transaksi yang menunggu persetujuan.</div>';
    }
    const userBox=document.getElementById('admin-users');
    if(userBox) userBox.innerHTML=users.map(u=>`
      <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
        <div class="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center overflow-hidden font-bold text-xs">
          ${u.avatar?`<img src="${u.avatar}" class="w-full h-full object-cover">`:escapeHtml((u.nama||'P').split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase())}
        </div>
        <div class="flex-1 min-w-0"><p class="text-xs font-bold truncate">${escapeHtml(u.nama)}</p><p class="text-[10px] text-slate-500">${u.isAdmin?'Administrator':'Pengguna'} • ${money(u.keuangan?.saldoUtama||0)} • Ref: ${escapeHtml(u.referralCode||'-')}</p></div>
      </div>`).join('');
}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function approveTransaction(userId,txId){
    if(!isAdmin)return;
    const users=loadUsersDB(), u=users.find(x=>x.id===userId), tx=(u?.transactions||[]).find(x=>x.id===txId);
    if(!u||!tx||tx.status!=='pending')return;
    if(tx.type==='deposit'){
        const depositAmount=Number(tx.amount)||0;
        u.keuangan=u.keuangan||{saldoUtama:0,totalInvestasi:0,totalImbal:0};
        u.keuangan.saldoUtama+=depositAmount;
        if(u.referredBy){
            const referrer=users.find(x=>x.id===u.referredBy);
            if(referrer){
                referrer.referralCommission=Number(referrer.referralCommission||0)+Math.floor(depositAmount*0.10);
                referrer.referralStats=referrer.referralStats||{users:0,approvedDeposits:0};
                referrer.referralStats.approvedDeposits=Number(referrer.referralStats.approvedDeposits||0)+1;
            }
        }
    }else{
        const amount=Number(tx.amount)||0;
        if((u.keuangan?.saldoUtama||0)<amount){alert('Saldo pengguna tidak mencukupi untuk menyetujui penarikan.');return;}
        u.keuangan.saldoUtama-=amount;
    }
    tx.status='approved'; tx.approvedAt=new Date().toLocaleString('id-ID');
    saveUsersDB(users); renderAdminPanel();
    if(u.id===userData.id){loadActiveUserIntoUI(u);updateUI();}
    alert(`${tx.type==='deposit'?'Deposit':'Penarikan'} untuk ${u.nama} disetujui.`);
}
function rejectTransaction(userId,txId){
    if(!isAdmin)return;
    const users=loadUsersDB(), u=users.find(x=>x.id===userId), tx=(u?.transactions||[]).find(x=>x.id===txId);
    if(!u||!tx||tx.status!=='pending')return;
    tx.status='rejected'; tx.rejectedAt=new Date().toLocaleString('id-ID');
    saveUsersDB(users); renderAdminPanel();
    if(u.id===userData.id){loadActiveUserIntoUI(u);updateUI();}
    alert(`Permintaan ${u.nama} ditolak.`);
}
function switchTab(tabName){
    const views={
      login:document.getElementById('view-login'), daftar:document.getElementById('view-daftar'),
      beranda:document.getElementById('view-beranda'), deposit:document.getElementById('view-deposit'),
      tarik:document.getElementById('view-tarik'), investasi:document.getElementById('view-investasi'),
      watchlist:document.getElementById('view-watchlist'), akun:document.getElementById('view-profil'), referral:document.getElementById('view-referral'),
      admin:document.getElementById('view-admin')
    };
    Object.values(views).forEach(v=>v?.classList.add('hidden'));
    if(tabName==='admin'&&!isAdmin){alert('Akses Admin Panel hanya tersedia untuk akun login pertama.');tabName='akun';}
    views[tabName]?.classList.remove('hidden');
    if(tabName==='beranda') setTimeout(showPromoPopup,180);
    const nav=document.getElementById('bottom-nav-container');
    if(nav) nav.classList.toggle('hidden',tabName==='login'||tabName==='daftar');
    if(tabName==='admin') renderAdminPanel();
    if(tabName==='akun') updateUI();
    if(tabName==='referral') updateReferralUI();
}

/* Riwayat status transaksi pada profil */
function renderUserTransactionHistory(){
    const profile=document.getElementById('view-profil');
    if(!profile||profile.querySelector('#user-tx-history'))return;
    const anchor=profile.querySelector('.mx-4.pt-2');
    if(!anchor)return;
    const box=document.createElement('div'); box.id='user-tx-history'; box.className='mx-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100';
    anchor.parentNode.insertBefore(box,anchor);
}
const OLD_UPDATE_UI_2=updateUI;
updateUI=function(){
    OLD_UPDATE_UI_2();
    renderUserTransactionHistory();
    const box=document.getElementById('user-tx-history');
    if(box){
      const tx=(getActiveUser()?.transactions||[]).slice(0,8);
      box.innerHTML='<h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Riwayat Deposit & Penarikan</h3>'+
        (tx.length?tx.map(t=>`<div class="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
          <div><p class="text-xs font-bold">${t.type==='deposit'?'Deposit':'Penarikan'} ${money(t.amount)}</p><p class="text-[9px] text-slate-400">${escapeHtml(t.time||'')}</p></div>
          <span class="approval-badge status-${t.status}">${t.status==='pending'?'MENUNGGU':t.status==='approved'?'DISETUJUI':'DITOLAK'}</span>
        </div>`).join(''):'<p class="text-[10px] text-slate-400">Belum ada transaksi.</p>');
    }
};


// Inisialisasi aplikasi setelah seluruh override terdaftar
(function initMultiUserApp(){
  // Sesi login disimpan di localStorage sehingga refresh tidak meminta login ulang.
  const active=getActiveUser();
  if(active){ loadActiveUserIntoUI(active); }
  else { switchTab('login'); }
  updateUI();
})();




(() => {
  const SUPABASE_URL = window.SUPABASE_URL || 'https://YOUR-PROJECT.supabase.co';
  const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
  const configured = !SUPABASE_URL.includes('YOUR-PROJECT') && !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE');
  if (!configured) {
    console.warn('Supabase belum dikonfigurasi. Edit SUPABASE_URL dan SUPABASE_ANON_KEY di index.html.');
    return;
  }

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.suryaSupabase = sb;
  let realProfile = null;
  let realAdmin = false;

  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const fmt = n => (typeof money === 'function' ? money(n) : 'Rp ' + Number(n||0).toLocaleString('id-ID'));

  async function loadProfile() {
    const { data:{ user } } = await sb.auth.getUser();
    if (!user) { realProfile=null; realAdmin=false; return null; }
    const { data, error } = await sb.from('profiles').select('*').eq('id', user.id).single();
    if (error) { console.error(error); return null; }
    realProfile=data; realAdmin=data.role==='admin';
    userData = Object.assign({}, userData, {
      id:user.id, nama:data.nama || user.user_metadata?.nama || user.email?.split('@')[0] || 'Pengguna',
      email:user.email || '', nomor:data.nomor || user.email || '', avatar:data.avatar_url || '',
      bank:data.bank || 'Belum terhubung', referralCode:data.referral_code || ''
    });
    dataKeuangan = { saldoUtama:Number(data.saldo||0), totalInvestasi:Number(data.total_investasi||0), totalImbal:Number(data.total_imbal||0) };
    isAdmin=realAdmin;
    return data;
  }

  async function refreshUser() {
    await loadProfile();
    try { updateUI(); } catch(e) {}
    if (realAdmin) renderRealAdmin();
  }

  // Auth nyata: password tidak disimpan di localStorage/database aplikasi.
  window.prosesDaftar = async function(){
    const nama=$('daftar-nama')?.value.trim();
    const email=$('daftar-nomor')?.value.trim().toLowerCase();
    const password=$('daftar-password')?.value || '';
    const konfirmasi=$('daftar-konfirmasi')?.value || '';
    if(!nama||!email||!password||!konfirmasi){alert('Semua kolom wajib diisi. Masukkan email yang valid.');return;}
    if(!email.includes('@')){alert('Untuk akun publik nyata, gunakan alamat email yang valid.');return;}
    if(password.length<6){alert('Password minimal 6 karakter.');return;}
    if(password!==konfirmasi){alert('Password dan konfirmasi tidak cocok.');return;}
    const {data,error}=await sb.auth.signUp({email,password,options:{data:{nama}}});
    if(error){alert(error.message);return;}
    if(data.session){
      await loadProfile(); alert(realAdmin?'Akun pertama berhasil dibuat sebagai ADMIN.':'Akun berhasil dibuat sebagai USER.'); switchTab('beranda'); await refreshUser();
    } else {
      alert('Pendaftaran berhasil. Akun siap digunakan. Silakan masuk dengan email dan password.'); switchTab('login');
    }
  };

  window.prosesLogin = async function(){
    const email=$('login-identifier')?.value.trim().toLowerCase();
    const password=$('login-password')?.value || '';
    if(!email||!password){alert('Masukkan email dan password.');return;}
    const {data,error}=await sb.auth.signInWithPassword({email,password});
    if(error){alert(error.message);return;}
    await loadProfile();
    if(!realProfile){alert('Profil akun belum tersedia. Jalankan SQL Supabase terlebih dahulu.');return;}
    alert(realAdmin?'Login berhasil. Anda adalah Administrator.':'Login berhasil. Selamat datang.');
    switchTab('beranda'); await refreshUser();
  };

  window.prosesLogout = async function(){
    await sb.auth.signOut(); realProfile=null; realAdmin=false; isAdmin=false;
    userData={nama:'Pengguna',nomor:'',email:'',id:''};
    dataKeuangan={saldoUtama:0,totalInvestasi:0,totalImbal:0};
    switchTab('login');
  };

  window.switchTab = function(tabName){
    const views={login:$('view-login'),daftar:$('view-daftar'),beranda:$('view-beranda'),deposit:$('view-deposit'),tarik:$('view-tarik'),investasi:$('view-investasi'),watchlist:$('view-watchlist'),akun:$('view-profil'),referral:$('view-referral'),admin:$('view-admin')};
    Object.values(views).forEach(v=>v?.classList.add('hidden'));
    if(tabName==='admin'&&!realAdmin){alert('Admin Panel hanya dapat dibuka oleh akun administrator.');tabName='akun';}
    views[tabName]?.classList.remove('hidden');
    const nav=$('bottom-nav-container'); if(nav) nav.classList.toggle('hidden',tabName==='login'||tabName==='daftar');
    if(tabName==='admin') renderRealAdmin();
    if(tabName==='akun') renderRealHistory();
  };

  window.prosesDeposit = function(){
    if(!realProfile){alert('Silakan login terlebih dahulu.');return;}
    $('payment-deposit-nominal').innerText=fmt(currentDeposit);
    $('deposit-payment-modal')?.classList.add('show'); document.body.style.overflow='hidden';
  };

  window.konfirmasiSudahBayar = async function(){
    if(!realProfile)return;
    const {error}=await sb.from('transactions').insert({user_id:realProfile.id,type:'deposit',amount:Number(currentDeposit),status:'pending'});
    if(error){alert(error.message);return;}
    closeDepositPayment(); showStatusModal('Permintaan deposit tersimpan dan menunggu persetujuan admin.'); await refreshUser();
  };

  window.prosesTarik = async function(){
    if(!realProfile){alert('Silakan login terlebih dahulu.');return;}
    const jenis=$('tarik-jenis-bank')?.value;
    const rekening=$('tarik-no-rekening')?.value.trim();
    const nama=$('tarik-nama-rekening')?.value.trim();
    if(!rekening||!nama){alert('Lengkapi rekening/e-wallet dan nama pemilik.');return;}
    if(Number(currentTarik)<=0||Number(currentTarik)>Number(dataKeuangan.saldoUtama)){alert('Saldo tidak mencukupi atau nominal belum dipilih.');return;}
    const {error}=await sb.from('transactions').insert({user_id:realProfile.id,type:'withdraw',amount:Number(currentTarik),status:'pending',bank:jenis,account:rekening,account_name:nama});
    if(error){alert(error.message);return;}
    const amount=currentTarik; currentTarik=0; updateTarikRincian(); showStatusModal(`Penarikan ${fmt(amount)} dikirim dan menunggu persetujuan admin.`); await refreshUser();
  };

  async function renderRealHistory(){
    if(!realProfile)return;
    const {data}=await sb.from('transactions').select('*').eq('user_id',realProfile.id).order('created_at',{ascending:false}).limit(8);
    const box=$('user-tx-history'); if(!box)return;
    box.innerHTML='<h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Riwayat Deposit & Penarikan</h3>'+
      ((data||[]).length?(data||[]).map(t=>`<div class="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"><div><p class="text-xs font-bold">${t.type==='deposit'?'Deposit':'Penarikan'} ${fmt(t.amount)}</p><p class="text-[9px] text-slate-400">${new Date(t.created_at).toLocaleString('id-ID')}</p></div><span class="approval-badge status-${esc(t.status)}">${t.status==='pending'?'MENUNGGU':t.status==='approved'?'DISETUJUI':'DITOLAK'}</span></div>`).join(''):'<p class="text-[10px] text-slate-400">Belum ada transaksi.</p>');
  }

  window.renderRealAdmin = async function(){
    if(!realAdmin)return;
    const [{data:users,error:uerr},{data:tx,error:terr}]=await Promise.all([
      sb.from('profiles').select('id,nama,email,role,saldo,referral_code,created_at').order('created_at',{ascending:false}),
      sb.from('transactions').select('*').eq('status','pending').order('created_at',{ascending:false})
    ]);
    if(uerr||terr){console.error(uerr||terr);return;}
    const pendingDep=(tx||[]).filter(t=>t.type==='deposit').length;
    const pendingWd=(tx||[]).filter(t=>t.type==='withdraw').length;
    const saldo=(users||[]).reduce((s,u)=>s+Number(u.saldo||0),0);
    $('admin-total-pengguna') && ($('admin-total-pengguna').innerText=users?.length||0);
    $('admin-saldo-sistem') && ($('admin-saldo-sistem').innerText=fmt(saldo));
    $('admin-pending-deposit') && ($('admin-pending-deposit').innerText=pendingDep);
    $('admin-pending-tarik') && ($('admin-pending-tarik').innerText=pendingWd);
    const byId=Object.fromEntries((users||[]).map(u=>[u.id,u]));
    const txBox=$('admin-transactions');
    if(txBox) txBox.innerHTML=(tx||[]).length?(tx||[]).map(t=>{const u=byId[t.user_id]||{};return `<div class="admin-tx-card"><div class="flex justify-between gap-2"><div><p class="text-xs font-bold text-slate-800">${esc(u.nama||'Pengguna')}</p><p class="text-[10px] text-slate-500">${t.type==='deposit'?'Deposit':'Penarikan'} • ${new Date(t.created_at).toLocaleString('id-ID')}</p></div><span class="approval-badge status-pending">MENUNGGU</span></div><p class="text-sm font-extrabold text-blue-700 mt-2">${fmt(t.amount)}</p>${t.type==='withdraw'?`<p class="text-[10px] text-slate-500 mt-1">${esc(t.bank||'')} • ${esc(t.account||'')} • ${esc(t.account_name||'')}</p>`:''}<div class="grid grid-cols-2 gap-2 mt-3"><button onclick="approveTransaction('${t.id}')" class="bg-emerald-600 text-white text-[10px] font-bold py-2 rounded-lg">Setujui</button><button onclick="rejectTransaction('${t.id}')" class="bg-red-50 text-red-600 text-[10px] font-bold py-2 rounded-lg border border-red-100">Tolak</button></div></div>`}).join(''):'<div class="text-center text-xs text-slate-400 py-5">Tidak ada transaksi yang menunggu persetujuan.</div>';
    const userBox=$('admin-users');
    if(userBox) userBox.innerHTML=(users||[]).map(u=>`<div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50"><div class="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">${esc((u.nama||'P').split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase())}</div><div class="flex-1 min-w-0"><p class="text-xs font-bold truncate">${esc(u.nama)}</p><p class="text-[10px] text-slate-500">${u.role==='admin'?'Administrator':'Pengguna'} • ${fmt(u.saldo||0)} • ${esc(u.email||'')}</p></div></div>`).join('');
  };

  window.approveTransaction = async function(txId){
    if(!realAdmin)return;
    const {error}=await sb.rpc('approve_transaction',{p_transaction_id:txId});
    if(error){alert(error.message);return;}
    alert('Transaksi berhasil disetujui.'); await renderRealAdmin(); await refreshUser();
  };
  window.rejectTransaction = async function(txId){
    if(!realAdmin)return;
    const {error}=await sb.rpc('reject_transaction',{p_transaction_id:txId});
    if(error){alert(error.message);return;}
    alert('Transaksi ditolak.'); await renderRealAdmin();
  };

  // Pastikan role admin berasal dari database, bukan localStorage/client.
  sb.auth.onAuthStateChange(async (_event, session) => {
    if(session){ setTimeout(async()=>{await refreshUser(); if(document.getElementById('view-daftar')&&!realProfile)switchTab('beranda');},0); }
    else { realProfile=null; realAdmin=false; }
  });

  (async()=>{
    const {data:{session}}=await sb.auth.getSession();
    if(session){await refreshUser(); switchTab('beranda');}
    else {switchTab('login');}
  })();
})();

