# -*- coding: utf-8 -*-

"""
Contains data that initially get added to the database to bootstrap it.
"""

from __future__ import unicode_literals

# pylint: disable=invalid-name

prophet_muhammad = {
    'title': u'Prophet',
    'display_name': u'النبي محمد (صلى الله عليه وآله وسلم)'.strip(),
    'full_name': u'محمد بن عبد الله بن عبد المطلب بن هاشم'.strip(),
    'brief_desc': u'نبي الإسلام، عليه وعلى آله الصلاة والسلام'.strip(),
    'birth_year': 570,
    'death_year': 632
}

imam_alsadiq = {
    'title': u'Imam',
    'display_name': u'الإمام الصادق (عليه السلام)',
    'full_name': u"جعفر بن محمد الصادق",
    'brief_desc': u'إمام من أئمة المسلمين وسادس أئمة الشيعة الاثنى عشرية'
}

# pylint: disable=line-too-long
first_shia_hadith_text = u'''
    نضر الله عبدا سمع مقالتي فوعاها وحفظها وبلغها من لم يسمعها، فرب حامل فقه غير فقيه ورب حامل فقه إلى من هو أفقه منه، ثلاث لا يغل عليهن قلب امرئ مسلم: إخلاص العمل لله، والنصحية لائمة المسلمين، واللزوم لجماعتهم، فإن دعوتهم محيطة من ورائهم، المسلمون إخوة تتكافى دماؤهم ويسعى بذمتهم أدناهم.
'''.strip()

first_sunni_hadith_text = u'''
نضر الله عبدا سمع مقالتي فحفظها ووعاها واداها ، فرب حامل فقه غير فقيه ، ورب حامل فقه الى من هو افقه منه ، ثلاث لا يغل عليهن قلب مسلم : اخلاص العمل لله ، والنصيحة للمسلمين ، ولزوم جماعتهم ، فان دعوتهم تحيط من ورايهم
'''.strip()
# pylint: enable=line-too-long

shia_first_hadith_persons = [
    u"عبد الله بن أبي يعفور العبدي".strip(),
    u"ابان بن عثمان الأحمر البجلي".strip(),
    u"احمد بن محمد بن عمرو بن ابي نصر البزنطي".strip(),
    u"احمد بن عيسى".strip()]

sunni_first_hadith_persons = [
    u"عبد الله بن مسعود".strip(),
    u"عبد الرحمن بن عبد الله الهذلي".strip(),
    u"عبد الملك بن عمير اللخمي".strip(),
    u"سفيان بن عيينة الهلالي".strip(),
]

holy_quran = u"القرآن الكريم"
holy_quran_suras = [
    u"الفاتحة",
    u"البقرة",
    u"آل عمران",
    u"النساء",
    u"المائدة",
    u"اﻷنعام",
    u"اﻷعراف",
    u"اﻷنفال",
    u"التوبة",
    u"يونس",
    u"هود",
    u"يوسف",
    u"الرعد",
    u"إبراهيم",
    u"الحجر",
    u"النحل",
    u"اﻹسراء",
    u"الكهف",
    u"مريم",
    u"طه",
    u"اﻷنبياء",
    u"الحج",
    u"المؤمنون",
    u"النور",
    u"الفرقان",
    u"الشعراء",
    u"النمل",
    u"القصص",
    u"العنكبوت",
    u"الروم",
    u"لقمان",
    u"السجدة",
    u"اﻷحزاب",
    u"سبأ",
    u"فاطر",
    u"يس",
    u"الصافات",
    u"ص",
    u"الزمر",
    u"غافر",
    u"فصلت",
    u"الشورى",
    u"الزخرف",
    u"الدخان",
    u"الجاثية",
    u"اﻷحقاف",
    u"محمد",
    u"الفتح",
    u"الحجرات",
    u"ق",
    u"الذاريات",
    u"الطور",
    u"النجم",
    u"القمر",
    u"الرحمن",
    u"الواقعة",
    u"الحديد",
    u"المجادلة",
    u"الحشر",
    u"الممتحنة",
    u"الصف",
    u"الجمعة",
    u"المنافقون",
    u"التغابن",
    u"الطلاق",
    u"التحريم",
    u"الملك",
    u"القلم",
    u"الحاقة",
    u"المعارج",
    u"نوح",
    u"الجن",
    u"المزمل",
    u"المدثر",
    u"القيامة",
    u"اﻹنسان",
    u"المرسلات",
    u"النبأ",
    u"النازعات",
    u"عبس",
    u"التكوير",
    u"الانفطار",
    u"المطففين",
    u"الانشقاق",
    u"البروج",
    u"الطارق",
    u"اﻷعلى",
    u"الغاشية",
    u"الفجر",
    u"البلد",
    u"الشمس",
    u"الليل",
    u"الضحى",
    u"الشرح",
    u"التين",
    u"العلق",
    u"القدر",
    u"البينة",
    u"الزلزلة",
    u"العاديات",
    u"القارعة",
    u"التكاثر",
    u"العصر",
    u"الهمزة",
    u"الفيل",
    u"قريش",
    u"الماعون",
    u"الكوثر",
    u"الكافرون",
    u"النصر",
    u"المسد",
    u"اﻹخلاص",
    u"الفلق",
    u"الناس"]

# كتاب الكافي، باب ما امر النبي صلى الله عليه وآله بالنصيحة لائمة
# المسلمين واللزوم لجماعتهم ومن هم؟
# http://www.mezan.net/books/kafi/kafi1/html/ara/books/al-kafi-1/166.html
shia_first_hadith_book = u"الكافي"
# مسند الشافعي، حديث 1105
# https://library.islamweb.net/hadith/display_hbook.php?bk_no=51&hid=1105&pid=
sunni_first_hadith_book = u"مسند الشافعي"

first_hadith_tag = u'علم الحديث'
