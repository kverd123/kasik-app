# Google Play Content Rating Questionnaire - Answer Guide

**App Name:** Kasik - Ek Gida Rehberi
**Package:** (your package name)
**Date Prepared:** 2026-04-02
**Questionnaire System:** IARC (International Age Rating Coalition)

---

## Overview

This document provides the exact answers to select for each question in the Google
Play Console IARC content rating questionnaire. Follow each section precisely to
ensure an accurate and compliant content rating for the app.

**Expected Final Rating:** PEGI 3 / Everyone (ESRB) / USK 0 / GRAC All / ACB G

---

## Pre-Questionnaire: App Category and Information

| Field | Answer |
|---|---|
| **App category** | Health & Fitness (or Parenting) |
| **Email address** | (your developer contact email) |
| **Privacy policy URL** | (your privacy policy URL - REQUIRED) |

---

## Section 1: Violence

| Question | Answer | Notes |
|---|---|---|
| Does the app contain violence or references to violence? | **No** | The app contains only baby food recipes, meal plans, and nutritional guidance. There is no violent content of any kind. |
| Does the app contain graphic violence or depictions of realistic violence? | **No** | Not applicable. |
| Does the app contain implied or light cartoon violence? | **No** | No cartoon violence exists in the app. |
| Is violence rewarded or encouraged? | **No** | Not applicable. |
| Does the app depict violence toward a specific race, ethnicity, religion, or other group? | **No** | Not applicable. |

**Section Outcome:** No violence flag. No rating impact.

---

## Section 2: Sexuality

| Question | Answer | Notes |
|---|---|---|
| Does the app contain sexual content or nudity? | **No** | The app is strictly a baby food guide. No sexual content exists. |
| Does the app contain partial nudity? | **No** | Not applicable. |
| Does the app contain graphic sexual content? | **No** | Not applicable. |
| Does the app contain sexual innuendo or suggestive themes? | **No** | Not applicable. |

**Section Outcome:** No sexuality flag. No rating impact.

---

## Section 3: Language

| Question | Answer | Notes |
|---|---|---|
| Does the app contain profanity or crude humor? | **No** | App content is professionally written nutritional and recipe guidance. |
| Does the app contain strong or explicit language? | **No** | Not applicable. |
| Does the app allow users to communicate or exchange content? | **Yes** | The community feature allows users to post, comment, and share photos about baby food. However, the language in user-generated content is moderated. Mark this in the User Interaction section (Section 5), not here. For THIS section, answer based on app-provided content only, which contains no profanity. |

**Section Outcome:** No language flag from app-provided content. No rating impact from this section.

---

## Section 4: Controlled Substances

| Question | Answer | Notes |
|---|---|---|
| Does the app reference or depict the use of tobacco? | **No** | Not applicable. |
| Does the app reference or depict the use of alcohol? | **No** | Not applicable. Some recipes may reference cooking with wine-based ingredients for adult meals, but this app is strictly about baby/infant food and does not include alcohol references. |
| Does the app reference or depict the use of drugs or illegal substances? | **No** | Not applicable. |
| Does the app depict or encourage the use of controlled substances? | **No** | Not applicable. |

**Section Outcome:** No controlled substance flag. No rating impact.

---

## Section 5: User Interaction / User-Generated Content

This is the most important section for Kasik due to the community features.

| Question | Answer | Notes |
|---|---|---|
| Can users interact with each other or exchange information through the app? | **Yes** | Community posts, comments, and photo sharing are available. |
| Does the app allow users to communicate freely (unrestricted text, audio, or video)? | **Yes** | Users can write free-text posts and comments in the community section. |
| Can users share or exchange content created by other users? | **Yes** | Users can share baby food photos, recipes, and tips. |
| Does the app allow users to share their location with other users? | **No** | The app does not include location-sharing features. |
| Does the app include social features such as chat rooms, messaging, or forums? | **Yes** | The community section functions as a forum for parents to discuss baby food topics. |
| Is user-generated content moderated or filtered? | **Yes** | Select this if you have content moderation in place (which is strongly recommended and likely required). Ensure you have: (1) content reporting mechanism, (2) moderation review process, (3) community guidelines, and (4) terms of use prohibiting harmful content. |
| Can users create accounts or profiles visible to other users? | **Yes** | Users have profiles in the community section. |

**IMPORTANT COMPLIANCE NOTE:**
Because the app has user-generated content and targets families/parents, you MUST have:
- A robust content moderation system (automated + manual review)
- A "Report" button on all user-generated content
- Published community guidelines
- Terms of service that prohibit harmful, illegal, and inappropriate content
- A mechanism to block/mute other users
- COPPA compliance measures if any child under 13 could access the app (even though the app targets parents, not children directly)

**Section Outcome:** The user interaction features will push the rating to at least PEGI 3 with an interactive elements descriptor. The "Users Interact" and "Digital Purchases" descriptors will be added to the rating.

---

## Section 6: Personal Information Sharing

| Question | Answer | Notes |
|---|---|---|
| Does the app collect or share personal information? | **Yes** | The app collects user account information (email, name) and baby profile data (age, allergen information). |
| Does the app share personal data with third parties? | **Yes** | Google AdMob receives device/advertising identifiers. Analytics services may also receive anonymized data. Disclose this accurately. |
| Does the app collect precise location data? | **No** | The app does not collect GPS or precise location data. |
| Does the app allow users to make purchases? | **Yes** | Premium subscription via in-app purchase. |
| Is the personal data handling disclosed in a privacy policy? | **Yes** | A privacy policy URL must be provided in the store listing and within the app itself. |
| Does the app collect data from children or is it directed at children? | **No** | The app is directed at parents and adult caregivers, not at children. However, because baby/child data is stored (age, allergens, food preferences), ensure your privacy policy explicitly addresses this. |

**CRITICAL COMPLIANCE NOTES:**

1. **KVKK (Turkish Data Protection Law):** Since this app targets Turkish users, ensure
   compliance with Turkey's KVKK (Kisisel Verilerin Korunmasi Kanunu), Law No. 6698.
   This requires explicit consent for data processing, a data controller registration
   with the VERBiS registry, and clear disclosure of data processing purposes.

2. **GDPR:** If serving EU users, full GDPR compliance is required including lawful
   basis for processing, data subject rights, and DPA with all processors.

3. **Google Play Families Policy:** If the app could attract children, review the
   Google Play Families Policy. Since this app is for parents (not children), you
   likely do NOT need to opt into the Designed for Families program, but ensure
   the target audience is set to "adults only" or "older users" in the Google Play
   Console target audience settings.

4. **Health Data Sensitivity:** Baby allergen data and dietary information may be
   considered health-related data under certain jurisdictions (GDPR Article 9
   special categories, KVKK sensitive data). Handle with elevated protections.

**Section Outcome:** "Shares Info" and "Digital Purchases" descriptors will be added.

---

## Section 7: Ads

| Question | Answer | Notes |
|---|---|---|
| Does the app contain ads? | **Yes** | Google AdMob ads are displayed in the app. |
| Are the ads age-appropriate and compliant with applicable policies? | **Yes** | Ensure AdMob is configured to serve only family-safe ads. Enable "max ad content rating" to G (General) in your AdMob settings. |
| Does the app contain ads for gambling or age-restricted products? | **No** | Configure AdMob to block gambling, alcohol, tobacco, and dating ad categories. |
| Does the ad SDK collect personal data? | **Yes** | AdMob collects device identifiers and behavioral data. This must be disclosed in your privacy policy. |
| Does the app offer an ad-free version or option? | **Yes** | Premium subscribers can access an ad-free experience through in-app purchase. |
| Does the app use personalized advertising? | **Yes (with user consent)** | The app offers personalized ads but obtains user consent first (via Google's UMP/Consent SDK). Non-personalized ads are served if consent is declined. |

**CRITICAL COMPLIANCE NOTES:**

1. **Google EU User Consent Policy:** You MUST integrate the Google User Messaging
   Platform (UMP) SDK or a certified Consent Management Platform (CMP) to collect
   consent from EEA, UK, and Swiss users before serving personalized ads. This is
   a Google requirement, not optional.

2. **ATT (App Tracking Transparency):** If you also have an iOS version, Apple's ATT
   framework is required. For Android, ensure compliance with the Google Advertising
   ID policies.

3. **Turkish E-Commerce Law:** Turkish regulations (Law No. 6563) require clear
   disclosure of commercial electronic communications. Ensure ad disclosures comply.

4. **AdMob Configuration Requirements:**
   - Set max ad content rating to G (General audiences)
   - Block sensitive ad categories: gambling, alcohol, tobacco, dating, politics
   - Enable child-directed treatment if any possibility of child users
   - Implement mediation for GDPR/KVKK consent signals

**Section Outcome:** "Contains Ads" descriptor will be added to the store listing.

---

## Section 8: Gambling

| Question | Answer | Notes |
|---|---|---|
| Does the app contain gambling or simulated gambling? | **No** | The app has no gambling features of any kind. |
| Does the app allow users to wager real money? | **No** | Not applicable. |
| Does the app contain simulated gambling (e.g., slot machines, card games, sports betting simulations)? | **No** | Not applicable. |
| Does the app facilitate real-money gambling? | **No** | Not applicable. |

**Section Outcome:** No gambling flag. No rating impact.

---

## Additional IARC Questions (Miscellaneous)

These questions may appear depending on your category selection.

| Question | Answer | Notes |
|---|---|---|
| Does the app contain horror themes or frightening content? | **No** | Not applicable. |
| Does the app promote or endorse discrimination? | **No** | Not applicable. |
| Is the app a browser or search engine that provides unrestricted web access? | **No** | The app is a standalone baby food guide. |
| Does the app contain any content that could be considered controversial? | **No** | Nutritional guidance and recipes are non-controversial. |

---

## Expected Rating Outcome Summary

| Rating System | Expected Rating | Rationale |
|---|---|---|
| **IARC Generic** | 3+ | User interaction features present; no objectionable content |
| **PEGI (Europe)** | PEGI 3 | Suitable for all age groups; interactive elements noted |
| **ESRB (Americas)** | Everyone | No content descriptors for violence, language, etc. |
| **USK (Germany)** | USK 0 (Approved without age restriction) | No restricted content |
| **GRAC (South Korea)** | All | No restricted content categories triggered |
| **ACB (Australia)** | G (General) | Suitable for general audiences |
| **ClassInd (Brazil)** | L (Livre / Free for all ages) | No restricted content |

### Content Descriptors That Will Appear

The following descriptors will be automatically added to your store listing based
on the answers above:

- **Users Interact** - Because the app has community features with user-generated content
- **Digital Purchases** - Because the app offers in-app purchases (premium subscription)
- **Contains Ads** - Because the app displays AdMob advertisements

---

## Pre-Submission Compliance Checklist

Before submitting the questionnaire, verify the following are in place:

### Privacy and Data Protection
- [ ] Privacy policy is published at an accessible URL
- [ ] Privacy policy URL is entered in Google Play Console (Store listing AND App content)
- [ ] Privacy policy covers all data collection including AdMob, analytics, and baby profile data
- [ ] KVKK compliance: registered with VERBiS if required, explicit consent flows implemented
- [ ] GDPR compliance: lawful basis documented, data subject rights implemented (if serving EU)
- [ ] Data Processing Agreements signed with all third-party processors (AdMob, analytics, etc.)

### App Content and Safety
- [ ] Content moderation system active for community posts and comments
- [ ] Report/flag mechanism available on all user-generated content
- [ ] Community guidelines published and accessible within the app
- [ ] Block/mute functionality available for users
- [ ] Terms of service published and accepted by users on registration

### Advertising Compliance
- [ ] Google UMP SDK integrated for consent management (EEA/UK users)
- [ ] AdMob max ad content rating set to G (General)
- [ ] Sensitive ad categories blocked (gambling, alcohol, tobacco, dating)
- [ ] Ad disclosure compliant with Turkish e-commerce regulations
- [ ] Non-personalized ads served when consent is declined

### In-App Purchases
- [ ] Subscription terms clearly disclosed before purchase
- [ ] Cancellation and refund policy accessible
- [ ] Turkish Consumer Protection Law (Law No. 6502) right of withdrawal disclosures in place
- [ ] Price displayed in local currency (TRY) with taxes included

### Target Audience Declaration
- [ ] Target audience set to appropriate age range in Google Play Console (not "children")
- [ ] App does NOT opt into Designed for Families program (unless specifically intended)
- [ ] If teacher-approved or family category desired, review additional requirements

### Google Play Policy Compliance
- [ ] Data Safety section completed accurately in Google Play Console
- [ ] App complies with Google Play User Data policy
- [ ] App complies with Google Play Ads policy
- [ ] App complies with Google Play Subscriptions policy
- [ ] App complies with Google Play Payments policy (using Google Play Billing)

---

## Regulatory References

| Regulation | Jurisdiction | Relevance to Kasik |
|---|---|---|
| KVKK (Law No. 6698) | Turkey | Primary data protection law. Requires VERBiS registration, explicit consent, and data processing disclosures. |
| GDPR (Regulation 2016/679) | EU/EEA | Applies if serving EU users. Requires lawful basis, DPO consideration, and data subject rights. |
| Turkish Consumer Protection Law (No. 6502) | Turkey | Governs in-app purchase disclosures, right of withdrawal, and subscription terms. |
| Turkish E-Commerce Law (No. 6563) | Turkey | Regulates commercial electronic communications and ad disclosures. |
| Google Play Developer Policies | Global | Platform-specific requirements for content, ads, billing, and data safety. |
| COPPA (15 U.S.C. 6501-6506) | United States | Relevant if the app is available in the US and could be accessed by children under 13. |

---

## Important Notes

1. **Answer honestly.** Misrepresenting your app content in the IARC questionnaire
   violates Google Play Developer Program Policies and can result in app removal or
   account suspension.

2. **Re-submit if features change.** If you add new features (e.g., video chat,
   direct messaging between users, new ad networks), you must re-complete the
   content rating questionnaire.

3. **Rating certificates are free.** The IARC rating process through Google Play
   Console is free of charge. No separate PEGI, ESRB, or other rating body
   submission is needed.

4. **Questionnaire timing.** Complete the questionnaire after all app features are
   finalized but before publishing. You can update ratings at any time through
   Google Play Console > App content > Content rating.

5. **Store listing alignment.** Ensure your store listing description, screenshots,
   and promotional materials are consistent with the content rating. Do not show
   content in marketing materials that exceeds your declared rating.
