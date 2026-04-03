/**
 * Kaşık — Ads Helper
 * Manages interstitial ads with frequency control
 */

import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const INTERSTITIAL_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : (process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID || 'ca-app-pub-8099877386187148/2055416996');

let interstitial: InterstitialAd | null = null;
let isLoaded = false;
let showCount = 0;

// Show interstitial every N actions (e.g. every 3 recipe views)
const SHOW_FREQUENCY = 3;

function loadInterstitial() {
  interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_ID, {
    requestNonPersonalizedAdsOnly: true,
  });

  interstitial.addAdEventListener(AdEventType.LOADED, () => {
    isLoaded = true;
  });

  interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    isLoaded = false;
    // Preload next ad
    loadInterstitial();
  });

  interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
    console.log('Interstitial ad error:', error);
    isLoaded = false;
  });

  interstitial.load();
}

/**
 * Initialize interstitial ads - call once at app start
 */
export function initInterstitialAds() {
  loadInterstitial();
}

/**
 * Try to show interstitial ad based on frequency
 * Returns true if ad was shown
 */
export function maybeShowInterstitial(): boolean {
  showCount++;
  if (showCount % SHOW_FREQUENCY !== 0) return false;
  if (!isLoaded || !interstitial) return false;

  try {
    interstitial.show();
    isLoaded = false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Show interstitial ad and wait for it to close (async).
 * Resolves true if the ad was shown and closed, false if it couldn't be shown.
 * Use this when you need to gate an action behind an ad.
 */
export function showInterstitialAsync(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!isLoaded || !interstitial) {
      resolve(false);
      return;
    }

    // Listen for close to resolve the promise
    const closeListener = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      closeListener();
      resolve(true);
    });

    try {
      interstitial.show();
      isLoaded = false;
    } catch {
      closeListener();
      resolve(false);
    }
  });
}
