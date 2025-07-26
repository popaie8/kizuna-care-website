# デザイン文書

## 概要

絆訪問介護サービスの公式ウェブサイトは、障害者総合支援法に基づく訪問介護サービスを提供する事業所として、利用者様とご家族様に信頼性の高い情報を提供し、スムーズなお問い合わせから利用開始までを支援するウェブサイトです。アクセシビリティとユーザビリティを重視し、高齢者や障害のある方でも使いやすいデザインを採用します。

## アーキテクチャ

### 技術スタック
- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **CSSフレームワーク**: Tailwind CSS 3.4 (高度なカスタマイズ性とパフォーマンス最適化)
- **フォント**: Noto Sans JP (日本語対応、読みやすさ重視)
- **アイコン**: Heroicons + Font Awesome 6 (Tailwindとの親和性)
- **地図**: Google Maps API (アクセス情報表示)
- **フォーム処理**: Netlify Forms (静的サイト対応)
- **アニメーション**: Intersection Observer API (スクロール連動)

### サイト構造
```
/
├── index.html (トップページ)
├── services/
│   ├── index.html (サービス一覧)
│   ├── juutaku-kaigo.html (重度訪問介護)
│   └── kyotaku-kaigo.html (居宅介護)
├── about/
│   ├── index.html (会社概要)
│   ├── testimonials.html (お客様の声)
│   └── access.html (アクセス情報)
├── flow/
│   └── index.html (利用の流れ)
├── recruit/ (求人採用 - メインコンテンツ)
│   ├── index.html (採用情報トップ)
│   ├── positions.html (募集職種詳細)
│   ├── benefits.html (待遇・福利厚生)
│   ├── culture.html (職場環境・企業文化)
│   └── apply.html (応募フォーム)
├── contact/
│   ├── index.html (お問い合わせ)
│   └── thanks.html (送信完了)
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── fonts/
└── sitemap.xml
```

## コンポーネントとインターフェース

### 1. ヘッダーコンポーネント
```html
<header class="header">
  <nav class="navbar navbar-expand-lg">
    <div class="container">
      <a class="navbar-brand" href="/">
        <img src="logo.png" alt="絆訪問介護サービス">
      </a>
      <div class="emergency-contact">
        <a href="tel:03-6820-5308" class="btn btn-emergency">
          24時間対応 03-6820-5308
        </a>
      </div>
    </div>
  </nav>
</header>
```

**機能:**
- ロゴとサイト名の表示
- 24時間対応電話番号の強調表示
- レスポンシブナビゲーション
- アクセシビリティ対応（キーボードナビゲーション）

### 2. 最適化されたヒーローセクション
```html
<section class="relative bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center">
  <!-- 背景装飾 -->
  <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
  
  <div class="container mx-auto px-4 relative z-10">
    <div class="max-w-6xl mx-auto">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- メインコンテンツ -->
        <div class="text-center lg:text-left">
          <!-- 緊急連絡先バッジ -->
          <div class="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
            </svg>
            24時間緊急対応 03-6820-5308
          </div>
          
          <h1 class="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            一人ひとりの<span class="text-blue-600">尊厳</span>を大切にし<br>
            <span class="text-indigo-600">その人らしい生活</span>を支援します
          </h1>
          
          <p class="text-xl text-gray-700 mb-8 leading-relaxed">
            江戸川区で24時間365日対応の重度訪問介護・居宅介護サービス<br>
            <span class="font-semibold text-blue-600">お客様満足度96%</span>の信頼できるケアをお届けします
          </p>
          
          <!-- 統計情報 -->
          <div class="grid grid-cols-3 gap-4 mb-8 p-6 bg-white/80 backdrop-blur rounded-2xl shadow-lg">
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600">4.8</div>
              <div class="text-sm text-gray-600">お客様評価</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600">96%</div>
              <div class="text-sm text-gray-600">満足度</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-600">24h</div>
              <div class="text-sm text-gray-600">365日対応</div>
            </div>
          </div>
          
          <!-- CTA ボタン -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a href="/contact/" 
               class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
              無料相談・お問い合わせ
            </a>
            <a href="tel:03-6820-5308" 
               class="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
              今すぐお電話
            </a>
          </div>
          
          <!-- 求人応募CTA -->
          <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p class="text-green-800 font-medium mb-2">一緒に働く仲間を募集中！</p>
            <a href="/recruit/" 
               class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 inline-block">
              求人情報を見る
            </a>
          </div>
        </div>
        
        <!-- お客様の声ハイライト -->
        <div class="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-2xl">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">お客様の声</h3>
            <div class="flex justify-center mb-4">
              <div class="flex text-yellow-400">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <blockquote class="text-lg text-gray-700 italic mb-6 leading-relaxed">
            "24時間体制で安心してお任せできます。スタッフの皆さんがとても親切で、私の生活リズムに合わせてサポートしてくださいます。家族も安心して仕事に集中できるようになりました。"
          </blockquote>
          
          <div class="text-center">
            <cite class="text-gray-600 font-medium">A様（60代男性）</cite>
            <p class="text-sm text-gray-500">重度訪問介護ご利用・利用期間2年</p>
          </div>
          
          <div class="mt-6 text-center">
            <a href="#testimonials" class="text-blue-600 hover:text-blue-700 font-medium">
              もっとお客様の声を見る →
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- スクロール促進アニメーション -->
  <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
    </svg>
  </div>
</section>
```

### 3. お客様の声セクション（トップページメイン）
```html
<section class="testimonials-main">
  <div class="container">
    <div class="section-header text-center">
      <h2>お客様の声</h2>
      <p class="section-subtitle">実際にサービスをご利用いただいているお客様からの声をご紹介します</p>
    </div>
    
    <div class="testimonials-grid">
      <div class="row">
        <div class="col-md-6">
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
              </div>
              <span class="service-type">重度訪問介護</span>
            </div>
            <blockquote>
              "24時間体制で安心してお任せできます。スタッフの皆さんがとても親切で、私の生活リズムに合わせてサポートしてくださいます。家族も安心して仕事に集中できるようになりました。"
            </blockquote>
            <cite>
              <strong>A様（60代男性）</strong><br>
              <small>利用期間：2年</small>
            </cite>
            <div class="testimonial-highlight">
              <i class="fas fa-check-circle"></i>
              24時間安心サポート
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
              </div>
              <span class="service-type">居宅介護</span>
            </div>
            <blockquote>
              "母の介護で困っていた時に絆さんに出会いました。母の気持ちに寄り添ってくださり、私たち家族の負担も大幅に軽減されました。本当に感謝しています。"
            </blockquote>
            <cite>
              <strong>B様ご家族（40代女性）</strong><br>
              <small>利用期間：1年半</small>
            </cite>
            <div class="testimonial-highlight">
              <i class="fas fa-heart"></i>
              家族の負担軽減
            </div>
          </div>
        </div>
      </div>
      
      <div class="row">
        <div class="col-md-6">
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
              </div>
              <span class="service-type">重度訪問介護</span>
            </div>
            <blockquote>
              "病気で体が不自由になってから、絆さんのサポートで自宅での生活を続けることができています。スタッフの方々の専門知識と温かい心遣いに日々感謝しています。"
            </blockquote>
            <cite>
              <strong>C様（50代女性）</strong><br>
              <small>利用期間：3年</small>
            </cite>
            <div class="testimonial-highlight">
              <i class="fas fa-home"></i>
              自宅での生活継続
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
              </div>
              <span class="service-type">居宅介護</span>
            </div>
            <blockquote>
              "急な依頼にも快く対応してくださり、とても助かっています。料金も明確で、安心してお願いできます。兄の笑顔が増えたのが何より嬉しいです。"
            </blockquote>
            <cite>
              <strong>D様ご家族（30代男性）</strong><br>
              <small>利用期間：8ヶ月</small>
            </cite>
            <div class="testimonial-highlight">
              <i class="fas fa-clock"></i>
              急な依頼にも対応
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="testimonials-summary">
      <div class="container">
        <div class="row text-center">
          <div class="col-md-3">
            <div class="summary-stat">
              <span class="summary-number">47</span>
              <span class="summary-label">お客様の声</span>
            </div>
          </div>
          <div class="col-md-3">
            <div class="summary-stat">
              <span class="summary-number">4.8</span>
              <span class="summary-label">平均評価</span>
            </div>
          </div>
          <div class="col-md-3">
            <div class="summary-stat">
              <span class="summary-number">96%</span>
              <span class="summary-label">満足度</span>
            </div>
          </div>
          <div class="col-md-3">
            <div class="summary-stat">
              <span class="summary-number">99%</span>
              <span class="summary-label">推奨率</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="text-center">
      <a href="/about/testimonials.html" class="btn btn-outline-primary">
        もっとお客様の声を見る
      </a>
    </div>
  </div>
</section>
```

### 4. サービス概要カード
```html
<div class="service-card">
  <div class="service-icon">
    <i class="fas fa-hands-helping" aria-hidden="true"></i>
  </div>
  <h3>重度訪問介護</h3>
  <p>重度の障害により常時介護を必要とする方への長時間総合支援</p>
  <ul class="service-features">
    <li>月最大744時間対応</li>
    <li>1対1のマンツーマンケア</li>
    <li>医療的ケア対応</li>
  </ul>
  <a href="/services/juutaku-kaigo.html" class="btn btn-outline-primary">詳細を見る</a>
</div>
```

### 4. 求人採用セクション（メインコンテンツ）
```html
<section class="recruit-hero">
  <div class="container">
    <div class="recruit-hero-content">
      <h1>一緒に働く仲間を募集しています</h1>
      <p class="lead">利用者様の「その人らしい生活」を支援する、やりがいのあるお仕事です</p>
      <div class="recruit-highlights">
        <div class="highlight-item">
          <span class="highlight-number">月給23万円〜</span>
          <span class="highlight-text">経験・資格に応じて</span>
        </div>
        <div class="highlight-item">
          <span class="highlight-number">24時間</span>
          <span class="highlight-text">シフト制で働きやすい</span>
        </div>
        <div class="highlight-item">
          <span class="highlight-number">資格取得</span>
          <span class="highlight-text">支援制度あり</span>
        </div>
      </div>
      <a href="/recruit/apply.html" class="btn btn-primary btn-lg">今すぐ応募する</a>
    </div>
  </div>
</section>

<section class="job-positions">
  <div class="container">
    <h2>募集職種</h2>
    <div class="row">
      <div class="col-md-6">
        <div class="position-card featured">
          <div class="position-badge">急募</div>
          <h3>介護福祉士・サービス提供責任者候補</h3>
          <div class="position-details">
            <p><strong>雇用形態:</strong> 正社員・契約社員</p>
            <p><strong>月給:</strong> 280,000円〜380,000円</p>
            <p><strong>勤務時間:</strong> シフト制（24時間対応）</p>
            <p><strong>必要資格:</strong> 介護福祉士</p>
          </div>
          <a href="/recruit/positions.html#care-worker" class="btn btn-outline-primary">詳細を見る</a>
        </div>
      </div>
      <div class="col-md-6">
        <div class="position-card">
          <h3>介護職員</h3>
          <div class="position-details">
            <p><strong>雇用形態:</strong> 正社員・パート</p>
            <p><strong>月給:</strong> 230,000円〜320,000円</p>
            <p><strong>勤務時間:</strong> シフト制</p>
            <p><strong>必要資格:</strong> 初任者研修以上</p>
          </div>
          <a href="/recruit/positions.html#care-staff" class="btn btn-outline-primary">詳細を見る</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="why-choose-us">
  <div class="container">
    <h2>絆訪問介護サービスで働く理由</h2>
    <div class="row">
      <div class="col-md-4">
        <div class="reason-item">
          <i class="fas fa-heart" aria-hidden="true"></i>
          <h3>やりがいのある仕事</h3>
          <p>利用者様の「その人らしい生活」を直接支援し、感謝の言葉を直接いただける仕事です。</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="reason-item">
          <i class="fas fa-graduation-cap" aria-hidden="true"></i>
          <h3>充実した研修制度</h3>
          <p>新人研修プログラム、月1回の技術研修、資格取得支援制度で成長をサポートします。</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="reason-item">
          <i class="fas fa-users" aria-hidden="true"></i>
          <h3>働きやすい環境</h3>
          <p>チームワークの良い職場で、利用者様からの感謝の声が直接聞けるやりがいのある仕事です。</p>
        </div>
      </div>
    </div>
  </div>
</section>


```

### 5. 応募フォーム
```html
<form class="application-form" method="POST" data-netlify="true" enctype="multipart/form-data">
  <div class="form-section">
    <h3>基本情報</h3>
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label for="applicant-name">お名前 <span class="required">*</span></label>
          <input type="text" id="applicant-name" name="applicant-name" required>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label for="applicant-age">年齢 <span class="required">*</span></label>
          <input type="number" id="applicant-age" name="applicant-age" min="18" max="70" required>
        </div>
      </div>
    </div>
    
    <div class="form-group">
      <label for="desired-position">希望職種 <span class="required">*</span></label>
      <select id="desired-position" name="desired-position" required>
        <option value="">選択してください</option>
        <option value="care-worker">介護福祉士・サービス提供責任者候補</option>
        <option value="care-staff">介護職員</option>
        <option value="nurse">看護師・准看護師</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="employment-type">希望雇用形態 <span class="required">*</span></label>
      <div class="checkbox-group">
        <label><input type="checkbox" name="employment-type" value="full-time"> 正社員</label>
        <label><input type="checkbox" name="employment-type" value="contract"> 契約社員</label>
        <label><input type="checkbox" name="employment-type" value="part-time"> パート</label>
      </div>
    </div>
  </div>
  
  <div class="form-section">
    <h3>資格・経験</h3>
    <div class="form-group">
      <label for="qualifications">保有資格</label>
      <div class="checkbox-group">
        <label><input type="checkbox" name="qualifications" value="care-worker"> 介護福祉士</label>
        <label><input type="checkbox" name="qualifications" value="initial-training"> 介護職員初任者研修</label>
        <label><input type="checkbox" name="qualifications" value="nurse"> 看護師</label>
        <label><input type="checkbox" name="qualifications" value="care-manager"> ケアマネジャー</label>
        <label><input type="checkbox" name="qualifications" value="other"> その他</label>
      </div>
    </div>
    
    <div class="form-group">
      <label for="experience-years">介護業界での経験年数</label>
      <select id="experience-years" name="experience-years">
        <option value="">選択してください</option>
        <option value="none">未経験</option>
        <option value="1-2">1〜2年</option>
        <option value="3-5">3〜5年</option>
        <option value="6-10">6〜10年</option>
        <option value="10+">10年以上</option>
      </select>
    </div>
  </div>
  
  <div class="form-section">
    <h3>志望動機・自己PR</h3>
    <div class="form-group">
      <label for="motivation">志望動機 <span class="required">*</span></label>
      <textarea id="motivation" name="motivation" rows="5" required 
                placeholder="なぜ絆訪問介護サービスで働きたいと思われましたか？"></textarea>
    </div>
    
    <div class="form-group">
      <label for="self-pr">自己PR</label>
      <textarea id="self-pr" name="self-pr" rows="4" 
                placeholder="あなたの強みや介護に対する想いをお聞かせください"></textarea>
    </div>
  </div>
  
  <div class="form-section">
    <h3>履歴書・職務経歴書</h3>
    <div class="form-group">
      <label for="resume">履歴書 <span class="required">*</span></label>
      <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" required>
      <small class="form-text">PDF、Word形式（5MB以下）</small>
    </div>
    
    <div class="form-group">
      <label for="work-history">職務経歴書</label>
      <input type="file" id="work-history" name="work-history" accept=".pdf,.doc,.docx">
      <small class="form-text">PDF、Word形式（5MB以下）</small>
    </div>
  </div>
  
  <div class="form-actions">
    <button type="submit" class="btn btn-primary btn-lg">応募書類を送信する</button>
    <p class="form-note">
      送信後、3営業日以内にご連絡いたします。<br>
      お急ぎの場合は直接お電話ください：<a href="tel:03-6820-5308">03-6820-5308</a>
    </p>
  </div>
</form>
```

### 6. お問い合わせフォーム
```html
<form class="contact-form" method="POST" data-netlify="true">
  <div class="form-group">
    <label for="name">お名前 <span class="required">*</span></label>
    <input type="text" id="name" name="name" required aria-describedby="name-help">
    <small id="name-help" class="form-text">フルネームでご入力ください</small>
  </div>
  
  <div class="form-group">
    <label for="contact-method">ご希望の連絡方法 <span class="required">*</span></label>
    <select id="contact-method" name="contact-method" required>
      <option value="">選択してください</option>
      <option value="phone">お電話</option>
      <option value="email">メール</option>
    </select>
  </div>
  
  <div class="form-group">
    <label for="inquiry-type">お問い合わせ内容 <span class="required">*</span></label>
    <select id="inquiry-type" name="inquiry-type" required>
      <option value="">選択してください</option>
      <option value="service-info">サービス内容について</option>
      <option value="cost">料金について</option>
      <option value="application">利用申請について</option>
      <option value="emergency">緊急対応について</option>
    </select>
  </div>
  
  <div class="form-group">
    <label for="message">詳細・ご質問 <span class="required">*</span></label>
    <textarea id="message" name="message" rows="5" required 
              aria-describedby="message-help"></textarea>
    <small id="message-help" class="form-text">
      現在の状況やご希望について詳しくお聞かせください
    </small>
  </div>
  
  <button type="submit" class="btn btn-primary btn-lg">送信する</button>
</form>
```

## データモデル

### 1. サービス情報モデル
```javascript
const serviceData = {
  juutakuKaigo: {
    name: "重度訪問介護",
    description: "重度の障害により常時介護を必要とする方への長時間総合支援",
    targetUsers: [
      "重度の肢体不自由者（障害支援区分4以上）",
      "知的障害又は精神障害により行動上著しい困難を有する者（障害支援区分4以上）",
      "重度の知的障害者・精神障害者（障害支援区分4以上）"
    ],
    services: [
      {
        category: "身体介護",
        items: ["食事の介助・見守り", "入浴・清拭の介助", "排泄の介助・おむつ交換"]
      },
      {
        category: "家事援助・生活支援", 
        items: ["調理・食事の準備", "掃除・洗濯・整理整頓", "買い物・外出の付き添い"]
      }
    ],
    maxHours: 744,
    costPerHour: 150
  }
};
```

### 2. 会社情報モデル
```javascript
const companyData = {
  name: "絆訪問介護サービス",
  legalName: "合同会社K&Kサービス",
  established: "令和4年4月",
  licenseNumber: "1312304759",
  contact: {
    phone: "03-6820-5308",
    fax: "03-6820-5309",
    email: "info@kizuna-houmon.jp",
    website: "https://kizuna-houmon.jp"
  },
  address: {
    postal: "133-0056",
    full: "東京都江戸川区南小岩7丁目37番5号 101号室"
  },
  serviceArea: ["江戸川区全域", "葛飾区", "墨田区", "江東区", "市川市"]
};
```

### 3. 求人情報モデル
```javascript
const recruitData = {
  positions: [
    {
      id: "care-worker",
      title: "介護福祉士・サービス提供責任者候補",
      type: ["正社員", "契約社員"],
      salary: {
        min: 280000,
        max: 380000,
        unit: "月給"
      },
      requirements: [
        "介護福祉士資格",
        "普通自動車免許（AT限定可）",
        "介護業界経験3年以上（優遇）"
      ],
      responsibilities: [
        "重度訪問介護・居宅介護サービスの提供",
        "サービス提供責任者業務",
        "利用者様・ご家族様との連絡調整",
        "ケアプランの作成・見直し"
      ],
      workingHours: "シフト制（24時間対応）",
      benefits: [
        "各種社会保険完備",
        "退職金制度",
        "資格取得支援",
        "研修制度充実"
      ],
      urgent: true
    },
    {
      id: "care-staff",
      title: "介護職員",
      type: ["正社員", "パート"],
      salary: {
        min: 230000,
        max: 320000,
        unit: "月給"
      },
      requirements: [
        "介護職員初任者研修以上",
        "普通自動車免許（AT限定可）",
        "未経験者歓迎"
      ],
      responsibilities: [
        "身体介護（食事・入浴・排泄介助等）",
        "生活援助（調理・掃除・買い物等）",
        "外出・通院の付き添い",
        "見守り・安全確保"
      ],
      workingHours: "シフト制（8:00〜18:00中心）",
      benefits: [
        "各種社会保険完備",
        "交通費支給",
        "資格取得支援",
        "新人研修プログラム"
      ],
      urgent: false
    }
  ],
  companyBenefits: {
    welfare: [
      "各種社会保険完備（健康保険・厚生年金・雇用保険・労災保険）",
      "退職金制度",
      "有給休暇・特別休暇",
      "定期健康診断",
      "インフルエンザ予防接種補助"
    ],
    education: [
      "新人研修プログラム（2週間）",
      "OJT制度（先輩によるマンツーマン指導）",
      "月1回の技術研修",
      "資格取得支援制度",
      "外部研修参加支援"
    ],
    workEnvironment: [
      "チームワークの良い職場",
      "24時間シフト制で働きやすい",
      "利用者様からの感謝の声が直接聞ける",
      "やりがいのある仕事",
      "お客様満足度96%の高品質サービス"
    ]
  }
};
```

### 4. お客様の声モデル
```javascript
const testimonialsData = {
  testimonials: [
    {
      id: 1,
      name: "A様（60代男性）",
      service: "重度訪問介護",
      period: "利用期間：2年",
      rating: 5,
      comment: "24時間体制で安心してお任せできます。スタッフの皆さんがとても親切で、私の生活リズムに合わせてサポートしてくださいます。家族も安心して仕事に集中できるようになりました。",
      highlight: "24時間安心サポート"
    },
    {
      id: 2,
      name: "B様ご家族（40代女性）",
      service: "居宅介護",
      period: "利用期間：1年半",
      rating: 5,
      comment: "母の介護で困っていた時に絆さんに出会いました。母の気持ちに寄り添ってくださり、私たち家族の負担も大幅に軽減されました。本当に感謝しています。",
      highlight: "家族の負担軽減"
    },
    {
      id: 3,
      name: "C様（50代女性）",
      service: "重度訪問介護",
      period: "利用期間：3年",
      rating: 5,
      comment: "病気で体が不自由になってから、絆さんのサポートで自宅での生活を続けることができています。スタッフの方々の専門知識と温かい心遣いに日々感謝しています。",
      highlight: "自宅での生活継続"
    },
    {
      id: 4,
      name: "D様ご家族（30代男性）",
      service: "居宅介護",
      period: "利用期間：8ヶ月",
      rating: 5,
      comment: "急な依頼にも快く対応してくださり、とても助かっています。料金も明確で、安心してお願いできます。兄の笑顔が増えたのが何より嬉しいです。",
      highlight: "急な依頼にも対応"
    }
  ],
  summary: {
    totalReviews: 47,
    averageRating: 4.8,
    satisfactionRate: 96.2,
    recommendationRate: 98.9
  }
};
```

## エラーハンドリング

### 1. フォーム検証エラー
```javascript
const formValidation = {
  validateRequired: (field) => {
    if (!field.value.trim()) {
      showError(field, 'この項目は必須です');
      return false;
    }
    return true;
  },
  
  validatePhone: (field) => {
    const phoneRegex = /^[\d\-\(\)\+\s]+$/;
    if (!phoneRegex.test(field.value)) {
      showError(field, '正しい電話番号を入力してください');
      return false;
    }
    return true;
  },
  
  validateEmail: (field) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value)) {
      showError(field, '正しいメールアドレスを入力してください');
      return false;
    }
    return true;
  }
};
```

### 2. ネットワークエラー処理
```javascript
const handleNetworkError = (error) => {
  const errorMessage = document.getElementById('error-message');
  errorMessage.innerHTML = `
    <div class="alert alert-danger" role="alert">
      <h4>送信エラー</h4>
      <p>申し訳ございません。送信中にエラーが発生しました。</p>
      <p>お急ぎの場合は、直接お電話ください：<a href="tel:03-6820-5308">03-6820-5308</a></p>
      <button class="btn btn-primary" onclick="retrySubmission()">再送信</button>
    </div>
  `;
};
```

## テスト戦略

### 1. アクセシビリティテスト
- **WCAG 2.1 AA準拠**: 色のコントラスト比4.5:1以上
- **キーボードナビゲーション**: Tabキーでの操作確認
- **スクリーンリーダー対応**: aria-label、alt属性の適切な設定
- **フォーカス管理**: 視覚的なフォーカスインジケーター

### 2. レスポンシブテスト
```javascript
const breakpoints = {
  mobile: '320px - 767px',
  tablet: '768px - 1023px', 
  desktop: '1024px以上'
};

const testResponsive = () => {
  // 各ブレークポイントでのレイアウト確認
  // フォントサイズの適切性
  // タッチターゲットのサイズ（最小44px）
  // ナビゲーションの使いやすさ
};
```

### 3. パフォーマンステスト
- **ページ読み込み速度**: 3秒以内
- **画像最適化**: WebP形式、適切なサイズ
- **CSS/JS最小化**: 不要なコードの削除
- **CDN利用**: 静的リソースの高速配信

### 4. SEOテスト
```html
<!-- メタタグの例 -->
<head>
  <title>絆訪問介護サービス | 江戸川区の24時間対応重度訪問介護・居宅介護</title>
  <meta name="description" content="江戸川区の絆訪問介護サービス。24時間365日対応の重度訪問介護・居宅介護。障害者総合支援法に基づく安心のサービス。無料相談受付中。">
  <meta name="keywords" content="訪問介護,重度訪問介護,居宅介護,江戸川区,24時間,障害者支援">
  
  <!-- 構造化データ -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "絆訪問介護サービス",
    "telephone": "03-6820-5308",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "南小岩7丁目37番5号 101号室",
      "addressLocality": "江戸川区",
      "addressRegion": "東京都",
      "postalCode": "133-0056"
    }
  }
  </script>
</head>
```

### 5. ユーザビリティテスト
- **タスク完了率**: お問い合わせフォーム送信まで
- **エラー発生率**: フォーム入力エラーの頻度
- **満足度調査**: 情報の見つけやすさ
- **高齢者・障害者向けテスト**: 実際のターゲットユーザーでの検証