"""
Internationalization (i18n) utilities for LearnHouse API.

This module provides translation functionality for API responses,
error messages, and other user-facing text.
"""

import json
import os
from pathlib import Path
from typing import Dict, Optional
from fastapi import Request

# Supported locales
SUPPORTED_LOCALES = ["pt-BR", "en"]
DEFAULT_LOCALE = "pt-BR"

# Cache for loaded translations
_translations_cache: Dict[str, Dict] = {}


def _load_translations(locale: str) -> Dict:
    """
    Load translations from JSON file for a given locale.

    Args:
        locale: The locale code (e.g., 'pt-BR', 'en')

    Returns:
        Dictionary with all translations for the locale
    """
    if locale in _translations_cache:
        return _translations_cache[locale]

    # Get the locales directory path
    api_dir = Path(__file__).parent.parent.parent
    locale_file = api_dir / "locales" / locale / "messages.json"

    if not locale_file.exists():
        # Fallback to default locale if file doesn't exist
        if locale != DEFAULT_LOCALE:
            return _load_translations(DEFAULT_LOCALE)
        raise FileNotFoundError(f"Translation file not found: {locale_file}")

    with open(locale_file, "r", encoding="utf-8") as f:
        translations = json.load(f)

    _translations_cache[locale] = translations
    return translations


def get_locale_from_request(request: Request) -> str:
    """
    Extract locale from request headers (Accept-Language).

    Args:
        request: FastAPI Request object

    Returns:
        Locale code (e.g., 'pt-BR', 'en')
    """
    # Check Accept-Language header
    accept_language = request.headers.get("Accept-Language", "")

    # Parse Accept-Language header (simplified)
    # Example: "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
    if accept_language:
        languages = accept_language.split(",")
        for lang in languages:
            # Extract language code (before ';')
            lang_code = lang.split(";")[0].strip()

            # Check if we support this locale
            if lang_code in SUPPORTED_LOCALES:
                return lang_code

            # Check if we support the base language (e.g., 'en' from 'en-US')
            base_lang = lang_code.split("-")[0]
            for supported_locale in SUPPORTED_LOCALES:
                if supported_locale.startswith(base_lang):
                    return supported_locale

    # Check for custom header (X-Language)
    custom_lang = request.headers.get("X-Language", "")
    if custom_lang in SUPPORTED_LOCALES:
        return custom_lang

    # Default to pt-BR
    return DEFAULT_LOCALE


def translate(key: str, locale: str = DEFAULT_LOCALE, **kwargs) -> str:
    """
    Translate a message key to the specified locale.

    Args:
        key: Translation key in dot notation (e.g., 'auth.incorrect_credentials')
        locale: Target locale (e.g., 'pt-BR', 'en')
        **kwargs: Variables to interpolate in the translated string

    Returns:
        Translated string

    Example:
        >>> translate("auth.incorrect_credentials", locale="en")
        "Incorrect email or password"

        >>> translate("validation.min_length", locale="en", min=8)
        "Must be at least 8 characters"
    """
    # Ensure locale is supported
    if locale not in SUPPORTED_LOCALES:
        locale = DEFAULT_LOCALE

    # Load translations
    translations = _load_translations(locale)

    # Navigate through nested keys
    keys = key.split(".")
    value = translations

    for k in keys:
        if isinstance(value, dict) and k in value:
            value = value[k]
        else:
            # Key not found, return the key itself as fallback
            return key

    # If value is not a string, return the key
    if not isinstance(value, str):
        return key

    # Interpolate variables if provided
    if kwargs:
        try:
            value = value.format(**kwargs)
        except KeyError:
            # If interpolation fails, return the string as-is
            pass

    return value


def translate_with_request(key: str, request: Request, **kwargs) -> str:
    """
    Translate a message using the locale from the request.

    Args:
        key: Translation key
        request: FastAPI Request object
        **kwargs: Variables for interpolation

    Returns:
        Translated string
    """
    locale = get_locale_from_request(request)
    return translate(key, locale=locale, **kwargs)


class Translator:
    """
    Translator class for easier usage in routers.

    Example:
        translator = Translator(request)
        message = translator.t("auth.login_successful")
    """

    def __init__(self, request: Optional[Request] = None, locale: Optional[str] = None):
        """
        Initialize translator.

        Args:
            request: FastAPI Request object (to extract locale)
            locale: Explicit locale to use (overrides request)
        """
        if locale:
            self.locale = locale if locale in SUPPORTED_LOCALES else DEFAULT_LOCALE
        elif request:
            self.locale = get_locale_from_request(request)
        else:
            self.locale = DEFAULT_LOCALE

    def t(self, key: str, **kwargs) -> str:
        """
        Translate a key.

        Args:
            key: Translation key
            **kwargs: Variables for interpolation

        Returns:
            Translated string
        """
        return translate(key, locale=self.locale, **kwargs)

    def __call__(self, key: str, **kwargs) -> str:
        """Allow calling translator instance directly."""
        return self.t(key, **kwargs)


# Convenience function to create translator from request
def get_translator(request: Request) -> Translator:
    """
    Create a Translator instance from a request.

    Args:
        request: FastAPI Request object

    Returns:
        Translator instance

    Example:
        @router.post("/login")
        async def login(request: Request):
            t = get_translator(request)
            return {"message": t("auth.login_successful")}
    """
    return Translator(request)
