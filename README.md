# ETKB Siber Güvenlik Operasyon Merkezi Web Sitesi Kontrol Yazılımı / ETKB Cyber Security Operations Center Website Monitoring Software

Bu proje, Enerji ve Tabii Kaynaklar Bakanlığı için bir Siber Güvenlik Operasyon Merkezi web sitesi kontrol yazılımıdır. Belirlenen web sitelerine HTTP/HTTPS istekleri atarak "up" ve "down" durumlarını kontrol eder ve kesinti anında mail gönderir.
This project is a Website Monitoring Software for the Energy and Natural Resources Ministry's Cyber Security Operations Center. It sends HTTP/HTTPS requests to specified websites to check their "up" and "down" status and sends emails in case of outages.

## Yazar / Author

**Fatih Aşık**

- **Tarih / Date:** 20.01.2025
- **Email:** [fth.asik@gmail.com](mailto:fth.asik@gmail.com)

## Proje Açıklaması / Project Description

Bu yazılım, belirlenen websitelerine http/https istekleri atarak up/down durumlarını kontrol eder ve kesinti anında mail gönderir. Ayrıca, kullanıcıların giriş yapmasını, web sitelerini eklemelerini, düzenlemelerini ve silmelerini sağlar.
This software sends HTTP/HTTPS requests to specified websites to check their up/down status and sends an email in case of outages. It also allows users to log in, add, edit, and delete websites.

## Kullanılan Teknolojiler ve Kütüphaneler / Technologies and Libraries Used

### Frontend

- **React**: Kullanıcı arayüzünü oluşturmak için kullanıldı. / Used to create the user interface.
- **Material-UI (MUI)**: Kullanıcı arayüzü bileşenlerini stilize etmek ve düzenlemek için kullanıldı. / Used to style and arrange user interface components.
- **Formik**: Form yönetimi ve doğrulama işlemlerini kolaylaştırmak için kullanıldı. / Used to simplify form management and validation processes.
- **Yup**: Form doğrulama şemaları oluşturmak için kullanıldı. / Used to create form validation schemas.
- **Firebase**: Kimlik doğrulama ve veritabanı işlemleri için kullanıldı. / Used for authentication and database operations.
- **react-router-dom**: Sayfa yönlendirme işlemlerini yönetmek için kullanıldı. / Used to manage page routing.
- **chart.js**: Grafik ve veri görselleştirme işlemleri için kullanıldı. / Used for charting and data visualization.
- **react-chartjs-2**: Chart.js'i React ile kullanmak için kullanıldı. / Used to integrate Chart.js with React.

### Backend

- **Express**: Web sunucusu ve API oluşturmak için kullanıldı. / Used to create the web server and API.
- **Got**: HTTP/HTTPS istekleri atmak ve web sitelerinin durumunu kontrol etmek için kullanıldı. / Used to send HTTP/HTTPS requests and check the status of websites.
- **nodemailer**: Kesinti durumunda e-posta bildirimleri göndermek için kullanıldı. / Used to send email notifications in case of outages.

### Kullanım Amaçları / Usage Purposes

#### React

React, kullanıcı arayüzünü oluşturmada temel yapı taşımızdır. Bileşen tabanlı yaklaşımı sayesinde yeniden kullanılabilir ve yönetilebilir bileşenler oluşturduk.
React is the fundamental building block for creating the user interface. The component-based approach allows us to create reusable and manageable components.

#### Material-UI (MUI)

Material-UI, kullanıcı arayüzünü stilize etmek ve düzenlemek için kullanıldı. Button, TextField, Box gibi bileşenlerle şık ve kullanıcı dostu arayüzler oluşturuldu.
Material-UI is used to style and arrange the user interface. Components like Button, TextField, and Box help create elegant and user-friendly interfaces.

#### Formik

Formik, form yönetimi ve doğrulama işlemlerini kolaylaştırmak için kullanıldı. Form verilerinin yönetimi, submit işlemleri ve hata kontrolü Formik ile yapıldı.
Formik simplifies form management and validation processes. Managing form data, submission processes, and error control are handled with Formik.

#### Yup

Yup, form doğrulama şemaları oluşturmak için kullanıldı. Formik ile birlikte kullanılarak form alanlarının doğrulama işlemleri yapıldı.
Yup is used to create form validation schemas. It is used in conjunction with Formik to validate form fields.

#### Firebase

Firebase, kimlik doğrulama ve veritabanı işlemleri için kullanıldı. Kullanıcı kayıt, giriş işlemleri ve Firestore veritabanı ile kullanıcı rolleri yönetildi.
Firebase is used for authentication and database operations. User registration, login processes, and user roles are managed using Firestore.

#### react-router-dom

React Router, sayfa yönlendirme işlemlerini yönetmek için kullanıldı. Kullanıcıların farklı sayfalara erişimi ve yönlendirmeler bu kütüphane ile yapıldı.
React Router is used to manage page routing. User access to different pages and navigation are handled using this library.

#### chart.js & react-chartjs-2

Chart.js ve react-chartjs-2, grafik ve veri görselleştirme işlemleri için kullanıldı. Web sitelerinin durumunu ve kesinti sürelerini görselleştirmek için grafikler oluşturuldu.
Chart.js and react-chartjs-2 are used for charting and data visualization. They are used to visualize the status and downtime of websites.

#### Express

Express, web sunucusu ve API oluşturmak için kullanıldı. Backend kısmında veri işleme ve HTTP istekleri bu kütüphane ile yönetildi.
Express is used to create the web server and API. Data processing and HTTP requests are managed using this library on the backend.

#### Got

Got, HTTP/HTTPS istekleri atmak ve web sitelerinin durumunu kontrol etmek için kullanıldı. Belirlenen web sitelerine istekler gönderilerek durumları kontrol edildi.
Got is used to send HTTP/HTTPS requests and check the status of websites. Requests are sent to specified websites to check their status.

#### Nodemailer

Nodemailer, kesinti durumunda e-posta bildirimleri göndermek için kullanıldı. Web sitelerinde kesinti tespit edildiğinde belirlenen e-posta adreslerine bildirimler gönderildi.
Nodemailer is used to send email notifications in case of outages. When an outage is detected on websites, notifications are sent to specified email addresses.

## Kurulum ve Kullanım / Setup and Usage

1. Projeyi klonlayın / Clone the project
   ```bash
   git clone https://github.com/fatihasik/webcheck_App
   cd proje
   ```
