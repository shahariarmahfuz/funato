# বাংলা ফন্ট কালেকশন (Fonts Collection)

এই ফোল্ডারে আপনার প্রজেক্টের জন্য **July** ও **Kalpurush** ফন্টগুলো যুক্ত করা হয়েছে:

## ফোল্ডার স্ট্রাকচার

```
fonts/
├── fonts.css                     # CSS @font-face স্টাইলশীট
├── July/                         # জুলাই ফন্ট ফ্যামিলি (BCC Unicode)
│   ├── July-Regular.ttf
│   ├── July-Bold.ttf
│   ├── July-Italic.ttf
│   └── July-Bold-Italic.ttf
└── Kalpurush/                    # কালপুরুষ ফন্ট
    ├── kalpurush.ttf             # ইউনিকোড সংস্করণ (Standard Unicode)
    └── kalpurush-ANSI.ttf        # আনসি সংস্করণ (ANSI / Bijoy compatibility)
```

## ওয়েব প্রজেক্টে ব্যবহারের নিয়ম (Web Usage)

১. আপনার এইচটিএমএল বা সিএসএস ফাইলে `fonts.css` লিঙ্ক করুন:
```html
<link rel="stylesheet" href="./fonts/fonts.css">
```

২. সিএসএস দিয়ে ফন্ট অ্যাপ্লাই করুন:
```css
/* জুলাই ফন্ট ব্যবহারের জন্য */
.july-text {
  font-family: 'July', sans-serif;
}

/* কালপুরুষ ফন্ট ব্যবহারের জন্য */
.kalpurush-text {
  font-family: 'Kalpurush', sans-serif;
}
```

## লোকাল কম্পিউটারে ইন্সটল করার নিয়ম
- **Windows:** `.ttf` ফাইলগুলোতে রাইট ক্লিক করে **Install** বা **Install for all users** সিলেক্ট করুন।
- **macOS:** `.ttf` ফাইলে ডাবল ক্লিক করে **Install Font** দিন।
- **Linux:** ফন্ট ফাইলগুলো `~/.local/share/fonts/` ফোল্ডারে কপি করে টার্মিনালে `fc-cache -fv` রান করুন।
