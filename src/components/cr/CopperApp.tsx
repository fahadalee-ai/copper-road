import { ApplyDone, ApplyForm, ArticleScreen, ContactScreen, GuideScreen, LearnScreen } from "./learn";
import { AboutScreen, ApplicationDetail, Applications, EditProfile, FaqsScreen, Favorites, HelpScreen, Journey, Legal, Messages, NotifSettings, NotificationsScreen, PasswordScreen, ProfileScreen, SearchScreen, SettingsScreen, TestimonialsScreen } from "./profile";
import { Breeding, CatProfile, CatsScreen, GalleryScreen, KittenDetail, Pedigree } from "./cats";
import { CartScreen, Checkout, OrderConfirm, OrderDetail, OrdersScreen, ProductDetail, ShopScreen, Wishlist } from "./shop";
import { HomeScreen } from "./home";
import { Login, Onboarding, Register, ResetPassword, Splash, Welcome } from "./auth";
import { ApplyFab, BottomNav, Toasts } from "./ui";
import { useApp } from "@/lib/store";

export function CopperApp() {
  const { screen, theme } = useApp();
  const tab = screen.name === "main";
  return (
    <div data-theme={theme} className="relative h-dvh overflow-hidden bg-background text-foreground">
      <div className={tab ? "h-[calc(100%-76px)]" : "h-full"}>
        {screen.name === "splash" && <Splash />}
        {screen.name === "onboarding" && <Onboarding />}
        {screen.name === "login" && <Login />}
        {screen.name === "reset" && <ResetPassword />}
        {screen.name === "register" && <Register />}
        {screen.name === "welcome" && <Welcome />}
        {screen.name === "main" && screen.tab === "home" && <HomeScreen />}
        {screen.name === "main" && screen.tab === "cats" && <CatsScreen />}
        {screen.name === "main" && screen.tab === "shop" && <ShopScreen />}
        {screen.name === "main" && screen.tab === "learn" && <LearnScreen />}
        {screen.name === "main" && screen.tab === "profile" && <ProfileScreen />}
        {screen.name === "cat" && <CatProfile id={screen.id} />}
        {screen.name === "kitten" && <KittenDetail id={screen.id} />}
        {screen.name === "product" && <ProductDetail id={screen.id} />}
        {screen.name === "cart" && <CartScreen />}
        {screen.name === "checkout" && <Checkout />}
        {screen.name === "orderConfirm" && <OrderConfirm orderId={screen.orderId} />}
        {screen.name === "orders" && <OrdersScreen />}
        {screen.name === "order" && <OrderDetail id={screen.id} />}
        {screen.name === "wishlist" && <Wishlist />}
        {screen.name === "breeding" && <Breeding />}
        {screen.name === "pedigree" && <Pedigree id={screen.id} />}
        {screen.name === "article" && <ArticleScreen id={screen.id} />}
        {screen.name === "guide" && <GuideScreen id={screen.id} />}
        {screen.name === "apply" && <ApplyForm />}
        {screen.name === "applyDone" && <ApplyDone refId={screen.ref} />}
        {screen.name === "contact" && <ContactScreen />}
        {screen.name === "applications" && <Applications />}
        {screen.name === "application" && <ApplicationDetail id={screen.id} />}
        {screen.name === "journey" && <Journey />}
        {screen.name === "favorites" && <Favorites />}
        {screen.name === "messages" && <Messages />}
        {screen.name === "gallery" && <GalleryScreen />}
        {screen.name === "testimonials" && <TestimonialsScreen />}
        {screen.name === "about" && <AboutScreen />}
        {screen.name === "faqs" && <FaqsScreen />}
        {screen.name === "notifications" && <NotificationsScreen />}
        {screen.name === "notifSettings" && <NotifSettings />}
        {screen.name === "settings" && <SettingsScreen />}
        {screen.name === "editProfile" && <EditProfile />}
        {screen.name === "password" && <PasswordScreen />}
        {screen.name === "help" && <HelpScreen />}
        {screen.name === "legal" && <Legal doc={screen.doc} />}
        {screen.name === "search" && <SearchScreen />}
      </div>
      {tab && <BottomNav />}
      {tab && (screen.tab === "home" || screen.tab === "cats") && <ApplyFab />}
      <Toasts />
    </div>
  );
}
