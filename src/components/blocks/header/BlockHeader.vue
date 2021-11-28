<template>
  <header
    ref="headerRef"
    :class="{
      [BLOCK_HEADER_CLASS]: true,
      [BLOCK_HEADER_STICKY_CLASS]: isSticky,
      'block-header--with-shadow': isWithShadow,
    }"
  >
    <BlockHeaderBackground
      v-if="background"
      :background="background"
      :current-option="background.current"
      :image-url="background.image"
      :color="background.color"
      :overlay-opacity="background['overlay-opacity']"
      :is-transparent="isCurrentlyTransparent"
    />
    <div
      class="block-header__content"
      :class="{ 'block-header__content--open': isOpen }"
      :style="computedStyles"
    >
      <BlockHeaderLogo
        v-if="isLogoVisible"
        class="block-header__logo"
        :class="{ 'block-header__logo--m-with-cart': isCartVisible }"
        :url="logoUrl"
        :max-width="logoMaxWidth"
        :max-width-mobile="logoMaxWidthMobile"
        :height="logoHeight"
        :height-mobile="logoHeightMobile"
        :is-optimized="isLogoOptimized"
        :object-position="logoObjectPosition"
        :object-position-mobile="logoObjectPositionMobile"
        @click="$emit('logo-click')"
      />

      <ZyroHamburger
        v-if="items.length"
        class="block-header__burger"
        :class="{ 'block-header__burger--m-with-cart': isCartVisible }"
        :is-open="isOpen"
        @click.stop="$emit('toggle-visibility')"
      />

      <nav class="block-header__nav">
        <ul
          class="block-header__links"
          :class="[
            { 'block-header__links--open': isOpen },
            `block-header__links--align-${
              navigationPlacementMobile || navigationPlacement
            }`,
          ]"
        >
          <BlockHeaderItem
            v-for="item in items"
            :key="item.id"
            :item="item"
            :are-dropdowns-hidden="areDropdownsHidden"
            :dropdown-background-color="backgroundColor"
            :is-dropdown-transparent-mobile="background.current === 'image'"
            @navigation-item-click="$emit('navigation-item-click', $event)"
          />
        </ul>
      </nav>

      <BlockHeaderCart
        v-if="isCartVisible"
        class="block-header__cart"
        :cart-text="cartText"
        :cart-icon-size="cartIconSize"
        :items-in-cart="itemsInCart"
        @click="$emit('cart-click')"
      />
    </div>
  </header>
</template>

<script>
import ZyroHamburger from "../../../components/ZyroHamburger.vue";
import BlockHeaderBackground from "../../../components/blocks/header/BlockHeaderBackground.vue";
import BlockHeaderCart from "../../../components/blocks/header/BlockHeaderCart.vue";
import BlockHeaderItem from "../../../components/blocks/header/BlockHeaderItem.vue";
import BlockHeaderLogo from "../../../components/blocks/header/BlockHeaderLogo.vue";
import {
  NAVIGATION_LOGO_SPACING_MAP,
  NAVIGATION_LOGO_MENU_POSITION_MAP,
  NAVIGATION_JUSTIFY_CONTENT_MAP,
  NAVIGATION_LOGO_IMAGE_OBJECT_POSITION_MAP,
  BLOCK_HEADER_CLASS,
  BLOCK_HEADER_STICKY_CLASS,
} from "../../../constants";

export default {
  name: "BlockHeader",
  components: {
    ZyroHamburger,
    BlockHeaderCart,
    BlockHeaderLogo,
    BlockHeaderItem,
    BlockHeaderBackground,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    isSticky: {
      type: Boolean,
      default: false,
    },
    isTransparent: {
      type: Boolean,
      default: false,
    },
    hasUserScrolled: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      default: null,
    },
    isLogoVisible: {
      type: Boolean,
      default: false,
    },
    isCartVisible: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
      default: "",
    },
    logoUrl: {
      type: String,
      default: null,
    },
    cartText: {
      type: String,
      default: null,
    },
    itemsInCart: {
      type: Number,
      default: 0,
    },
    logoPlacement: {
      type: String,
      default: null,
    },
    logoPlacementMobile: {
      type: String,
      default: null,
    },
    navigationPlacement: {
      type: String,
      default: null,
    },
    navigationPlacementMobile: {
      type: String,
      default: null,
    },
    areDropdownsHidden: {
      type: Boolean,
      default: false,
    },
    isLogoOptimized: {
      type: Boolean,
      default: false,
    },
    background: {
      type: Object,
      default: null,
    },
    // CSS Properties
    cartIconSize: {
      type: String,
      default: null,
    },
    logoMaxWidth: {
      type: String,
      default: null,
    },
    logoHeight: {
      type: String,
      default: null,
    },
    logoHeightMobile: {
      type: String,
      default: null,
    },
    logoMaxWidthMobile: {
      type: String,
      default: null,
    },
    logoObjectPosition: {
      type: String,
      default: null,
    },
    logoObjectPositionMobile: {
      type: String,
      default: null,
    },
  },
  setup() {
    return {
      BLOCK_HEADER_CLASS,
      BLOCK_HEADER_STICKY_CLASS,
    };
  },
  data() {
    return {
      headerResizeObserver: null,
    };
  },
  computed: {
    isWithShadow() {
      return this.hasUserScrolled && this.isSticky;
    },
    shouldForceTransparency() {
      return (this.isSticky && !this.hasUserScrolled) || !this.isSticky;
    },
    isCurrentlyTransparent() {
      return this.isTransparent && this.shouldForceTransparency;
    },
    // TODO: Rework after Layout presets iteration
    isLogoAndNavigationCentered() {
      return (
        this.logoPlacement === "center" && this.navigationPlacement === "center"
      );
    },
    isLogoAndNavigationCenteredMobile() {
      return (
        this.logoPlacementMobile === "center" &&
        this.navigationPlacementMobile === "center"
      );
    },
    navigationGridRowCount() {
      if (this.isLogoVisible && this.isCartVisible) {
        return 3;
      }

      return 2;
    },
    computedStyles() {
      const placementKey = `${this.logoPlacement}-${this.navigationPlacement}`;
      const placementKeyMobile = `${this.logoPlacementMobile}-${this.navigationPlacementMobile}`;

      const { templateColumns } =
        NAVIGATION_LOGO_MENU_POSITION_MAP[placementKey];
      const templateColumnsMobile = this.isCartVisible
        ? "auto minmax(0, calc(var(--m-logo-width) + var(--space-between-menu) * 2)) 1fr"
        : NAVIGATION_LOGO_MENU_POSITION_MAP[placementKeyMobile]
            .mTemplateColumns;

      return {
        "--navigation-grid-template-columns": this.isLogoVisible
          ? templateColumns
          : "1fr",
        "--m-navigation-grid-template-columns": this.isLogoVisible
          ? templateColumnsMobile
          : "1fr",

        "--logo-grid-row": `${NAVIGATION_LOGO_MENU_POSITION_MAP[placementKey].logoRow}/${this.navigationGridRowCount}`,
        "--m-logo-grid-row": `${NAVIGATION_LOGO_MENU_POSITION_MAP[placementKeyMobile].logoRow}/${this.navigationGridRowCount}`,

        "--logo-grid-column":
          NAVIGATION_LOGO_MENU_POSITION_MAP[placementKey].logoColumn,
        "--m-logo-grid-column":
          NAVIGATION_LOGO_MENU_POSITION_MAP[placementKeyMobile].logoColumn,

        "--logo-justify-self": this.getJustifyContent(this.logoPlacement),
        "--m-logo-justify-self": this.getJustifyContent(
          this.logoPlacementMobile
        ),

        "--logo-image-object-position": this.getLogoImageObjectPosition(
          this.logoPlacement
        ),
        "--m-logo-image-object-position": this.getLogoImageObjectPosition(
          this.logoPlacementMobile
        ),

        "--links-grid-row": `${NAVIGATION_LOGO_MENU_POSITION_MAP[placementKey].menuRow}/${this.navigationGridRowCount}`,
        "--m-links-grid-row": `${NAVIGATION_LOGO_MENU_POSITION_MAP[placementKeyMobile].menuRow}/${this.navigationGridRowCount}`,

        "--links-grid-column": this.isLogoVisible
          ? NAVIGATION_LOGO_MENU_POSITION_MAP[placementKey].menuColumn
          : "1/2",
        "--m-links-grid-column": this.isLogoVisible
          ? NAVIGATION_LOGO_MENU_POSITION_MAP[placementKeyMobile].menuColumn
          : "1/2",

        "--cart-grid-row": `${NAVIGATION_LOGO_MENU_POSITION_MAP[placementKey].cartRow}/${this.navigationGridRowCount}`,
        "--cart-grid-column": this.isLogoVisible
          ? NAVIGATION_LOGO_MENU_POSITION_MAP[placementKey].cartColumn
          : "2/2",

        "--logo-spacing": this.getLogoMarginPlacement(),
        "--m-logo-spacing": this.getLogoMarginPlacement(true),

        "--navigation-text-align": this.navigationPlacement,
        "--m-navigation-text-align": this.navigationPlacementMobile,

        "--navigation-justify-self": this.getJustifyContent(
          this.navigationPlacement
        ),
        "--m-navigation-justify-self": this.getJustifyContent(
          this.navigationPlacementMobile
        ),

        "--mobileBackground":
          "var(--background-color,  var(--background-image))",
      };
    },
  },
  mounted() {
    this.$forceUpdate();

    this.headerResizeObserver = new ResizeObserver(([{ contentRect }]) => {
      requestAnimationFrame(() => {
        const { height } = contentRect;

        if (height !== this.height) {
          this.$emit("update-height", height);
        }
      });
    });

    this.headerResizeObserver.observe(this.$refs.headerRef);
  },
  beforeDestroy() {
    this.headerResizeObserver.disconnect();
  },
  methods: {
    getJustifyContent(align) {
      return (
        NAVIGATION_JUSTIFY_CONTENT_MAP[align] ||
        NAVIGATION_JUSTIFY_CONTENT_MAP.default
      );
    },
    getLogoImageObjectPosition(align) {
      return (
        NAVIGATION_LOGO_IMAGE_OBJECT_POSITION_MAP[align] ||
        NAVIGATION_LOGO_IMAGE_OBJECT_POSITION_MAP.default
      );
    },
    getLogoMarginPlacement(isMobile = false) {
      const isLogoAndNavigationCentered = isMobile
        ? this.isLogoAndNavigationCenteredMobile
        : this.isLogoAndNavigationCentered;
      const logoPlacement = isMobile
        ? this.logoPlacementMobile
        : this.logoPlacement;

      if (isMobile && this.isCartVisible) {
        return NAVIGATION_LOGO_SPACING_MAP.center;
      }

      if (isLogoAndNavigationCentered) {
        return NAVIGATION_LOGO_SPACING_MAP["center-center"];
      }

      return NAVIGATION_LOGO_SPACING_MAP[logoPlacement];
    },
  },
};
</script>

<style lang="scss">
@import "../../../assets/scss/abstracts";
@mixin transition-slide-down {
  transition-timing-function: cubic-bezier(0.45, 0, 0.1, 1);
  transition-duration: 0.2s;
  transition-property: opacity, transform;
}

.block-header {
  position: relative;
  z-index: $z-index-user--header;
  display: grid;
  grid-area: 1/1/-1/-1;
  grid-template-rows: 100%;
  grid-template-columns: 100%;
  width: 100%;
  transition: box-shadow 0.15s linear;

  &--is-sticky {
    position: sticky;
    top: var(--builderHeader-height, 0px);

    @include zyro-media($media-grid) {
      top: var(--builderHeader-height, 0px);
    }
  }

  &--with-shadow {
    box-shadow: $box-shadow;
  }

  &__content {
    z-index: $z-index-user--header;
    display: grid;
    grid-area: 1/1/-1/-1;
    grid-template-columns: var(--navigation-grid-template-columns);
    align-items: center;
    width: 100%;
    max-width: var(--width, 1200px);
    padding: var(--padding, 24px 0);
    margin: 0 auto;
  }

  &__logo {
    display: inline-flex;
    grid-row: var(--logo-grid-row);
    grid-column: var(--logo-grid-column);
    align-self: center;
    justify-self: var(--logo-justify-self);
    margin: var(--logo-spacing);
  }

  &__nav {
    grid-row: var(--links-grid-row);
    grid-column: var(--links-grid-column);
    justify-self: var(--navigation-justify-self);
    height: 100%;
    margin-left: calc(-1 * var(--menu-item-spacing));
  }

  &__links {
    display: inline-flex;
    flex-direction: row;
    flex-wrap: wrap;
    row-gap: 16px;
    align-items: center;
    height: 100%;
    text-align: var(--navigation-text-align);
    list-style: none;
  }

  &__cart {
    display: inline-flex;
    grid-row: var(--cart-grid-row);
    grid-column: var(--cart-grid-column);
    align-self: center;
    justify-content: flex-end;
    width: 100%;
    height: 100%;
    background: transparent;
  }

  &__burger {
    display: none;
    grid-row: var(--links-grid-row);
    grid-column: var(--links-grid-column);
    justify-self: var(--navigation-justify-self);
    text-align: var(--navigation-text-align);
  }
}

@include zyro-media($media-grid) {
  .block-header {
    &__content {
      position: relative;
      grid-template-columns: var(--m-navigation-grid-template-columns);
      padding: var(--m-padding, var(--padding));
    }

    &__burger {
      display: block;
      grid-row: var(--m-links-grid-row);
      grid-column: var(--m-links-grid-column);
      justify-self: var(--m-navigation-justify-self);
      text-align: var(--m-navigation-text-align);

      &--m-with-cart {
        grid-row: 1/3;
        grid-column: 1/3;
        justify-self: flex-start;
      }
    }

    &__cart {
      margin: 0;
    }

    &__logo {
      grid-row: var(--m-logo-grid-row);
      grid-column: var(--m-logo-grid-column);
      justify-self: var(--m-logo-justify-self);
      margin: var(--m-logo-spacing);

      &--m-with-cart {
        grid-row: 1/3;
        grid-column: 2/3;
        justify-self: flex-start;
      }
    }

    &__nav {
      grid-row: unset;
      grid-column: unset;
    }

    &__links {
      $defaultItemSpacing: 16px;
      $subItemIndentation: 16px;

      position: absolute;
      top: 100%;
      right: 0;
      left: 0;
      display: grid;
      grid-gap: var(--m-menu-item-spacing, $defaultItemSpacing) 0;
      justify-self: var(--m-navigation-justify-self);
      width: auto;
      height: 0;
      max-height: 450px;
      padding: var(--m-menu-item-spacing, $defaultItemSpacing)
        var(--padding-left) var(--m-menu-item-spacing, $defaultItemSpacing)
        var(--padding-right);
      margin: 0;
      overflow-y: auto;
      text-align: var(--m-navigation-text-align);
      pointer-events: none;
      background: $background-overlay, var(--mobileBackground) no-repeat top;
      background-size: cover;
      box-shadow: 0 6px 14px -14px rgba(0, 0, 0, 0.1);
      opacity: 0;
      transform: translate(0, -1em);

      @include transition-slide-down;

      &--open {
        height: auto;
        pointer-events: auto;
        opacity: 1;
        transform: translate(0, 0);

        @include transition-slide-down;
      }

        .item-content-wrapper {
          display: grid;
        }

      &--align-left {
          .block-header-item__dropdown {
            align-items: flex-start;
            padding-left: calc(var(--padding-right) + #{$subItemIndentation});
          }

          .item-content-wrapper {
            grid-template-columns: auto 1fr auto;

            & > .item-content {
              grid-column: 1/2;
            }

            & > .item-content__icon-container-wrapper {
              grid-column: 2/3;
              align-self: start;
            }
        }
      }

      &--align-center {
          .block-header-item__dropdown {
            align-items: center;
          }

          .item-content-wrapper {
            grid-template-columns: 1fr auto 1fr;

            & > .item-content {
              grid-column: 2/3;
            }

            & > .item-content__icon-container-wrapper {
              grid-column: 3/4;
            }
        }
      }

      &--align-right {
          .block-header-item__dropdown {
            align-items: flex-end;
            padding-right: calc(var(--padding-right) + #{$subItemIndentation});
          }

          .item-content-wrapper {
            grid-template-columns: 1fr auto;

            & > .item-content {
              grid-column: 3/4;
            }

            & > .item-content__icon-container-wrapper {
              grid-row: 1;
              grid-column: 2/3;
              margin-right: 8px;
              margin-left: 0;
            }
          }
      }
    }
  }
}
</style>
