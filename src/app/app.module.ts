import { DateArSimplePipe } from './pipes/dateSimple.pipe';
import { BetCalculatorService } from './services/bet-calculator.service';
import { VersionService } from './services/version.service';
import { OddsPipe } from './pipes/odds.pipe';
import { IpService } from './services/ip.service';
import { OddService } from './services/odd.service';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragulaModule } from 'ng2-dragula';
import { ClipboardModule } from 'ngx-clipboard';
import { ContextMenuModule } from 'ngx-contextmenu';
import { NouisliderModule } from 'ng2-nouislider';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ColorPickerModule } from 'ngx-color-picker';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { TagInputModule } from 'ngx-chips';
import { FormWizardModule } from 'angular2-wizard';
import { NgxSummernoteModule } from 'ngx-summernote'; 
import { TinymceModule } from 'angular2-tinymce';
import { AceEditorModule } from 'ng2-ace-editor';
import { CodemirrorModule } from 'ng2-codemirror';
import { ChartsModule } from 'ng2-charts';
import { NgSelectModule } from '@ng-select/ng-select';
import { MorrisJsModule } from 'angular-morris-js';
import { ChartistModule } from 'ng-chartist';
import { DataTablesModule } from 'angular-datatables';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ToastrModule } from 'ngx-toastr';
import { AgmCoreModule } from '@agm/core';
import { BarRatingModule } from "ngx-bar-rating";
import { FullCalendarModule } from 'ng-fullcalendar'; 
import { ScrollToModule } from 'ng2-scroll-to-el';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { SettingsPanelComponent } from './components/shared/settings-panel/settings-panel.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Page404Component } from './components/error-pages/page404/page404.component';
import { WidgetsComponent } from './components/widgets/widgets.component';
import { AccordionsComponent } from './components/basic-ui-elements/accordions/accordions.component';
import { ButtonsComponent } from './components/basic-ui-elements/buttons/buttons.component';
import { TodoListComponent } from './components/apps/todo-list/todo-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation'
import { BadgesComponent } from './components/basic-ui-elements/badges/badges.component';
import { BreadcrumbsComponent } from './components/basic-ui-elements/breadcrumbs/breadcrumbs.component';
import { DropdownsComponent } from './components/basic-ui-elements/dropdowns/dropdowns.component';
import { ModalsComponent } from './components/basic-ui-elements/modals/modals.component';
import { ProgressbarComponent } from './components/basic-ui-elements/progressbar/progressbar.component';
import { PaginationComponent } from './components/basic-ui-elements/pagination/pagination.component';
import { TabsComponent } from './components/basic-ui-elements/tabs/tabs.component';
import { TypographyComponent } from './components/basic-ui-elements/typography/typography.component';
import { TooltipsComponent } from './components/basic-ui-elements/tooltips/tooltips.component';
import { ChartjsComponent } from './components/charts/chartjs/chartjs.component';
import { MorrisComponent } from './components/charts/morris/morris.component';
import { ChartistComponent } from './components/charts/chartist/chartist.component';
import { BasicTableComponent } from './components/tables/basic-table/basic-table.component';
import { DataTableComponent } from './components/tables/data-table/data-table.component';
import { PopupsComponent } from './components/advanced-ui-elements/popups/popups.component';
import { NotificationsComponent } from './components/advanced-ui-elements/notifications/notifications.component';
import { ThemifyComponent } from './components/icons/themify/themify.component';
import { FlagIconsComponent } from './components/icons/flag-icons/flag-icons.component';
import { MdiComponent } from './components/icons/mdi/mdi.component';
import { FontAwesomeComponent } from './components/icons/font-awesome/font-awesome.component';
import { SimpleLineIconsComponent } from './components/icons/simple-line-icons/simple-line-icons.component';
import { Page500Component } from './components/error-pages/page500/page500.component';
import { LoginComponent } from './components/general-pages/login/login.component';
import { Login2Component } from './components/general-pages/login2/login2.component';
import { RegisterComponent } from './components/general-pages/register/register.component';
import { Register2Component } from './components/general-pages/register2/register2.component';
import { LockscreenComponent } from './components/general-pages/lock-screen/lock-screen.component';
import { BlankPageComponent } from './components/general-pages/blank-page/blank-page.component';
import { ProfileComponent } from './components/general-pages/profile/profile.component';
import { FaqComponent } from './components/general-pages/faq/faq.component';
import { Faq2Component } from './components/general-pages/faq2/faq2.component';
import { NewsGridComponent } from './components/general-pages/news-grid/news-grid.component';
import { TimelineComponent } from './components/general-pages/timeline/timeline.component';
import { SearchResultsComponent } from './components/general-pages/search-results/search-results.component';
import { PortfolioComponent } from './components/general-pages/portfolio/portfolio.component';
import { InvoiceComponent } from './components/general-pages/invoice/invoice.component';
import { PricingComponent } from './components/general-pages/pricing/pricing.component';
import { OrdersComponent } from './components/general-pages/orders/orders.component';
import { EmailComponent } from './components/apps/email/email.component';
import { CalendarComponent } from './components/apps/calendar/calendar.component';
import { DragulaComponent } from './components/advanced-ui-elements/dragula/dragula.component';
import { ClipboardComponent } from './components/advanced-ui-elements/clipboard/clipboard.component';
import { MyContextMenuComponent } from './components/advanced-ui-elements/context-menu/context-menu.component';
import { SliderComponent } from './components/advanced-ui-elements/slider/slider.component';
import { CarouselComponent } from './components/advanced-ui-elements/carousel/carousel.component';
import { LoadersComponent } from './components/advanced-ui-elements/loaders/loaders.component';
import { BasicElementsComponent } from './components/forms/basic-elements/basic-elements.component';
import { AdvancedElementsComponent } from './components/forms/advanced-elements/advanced-elements.component';
import { TextEditorComponent } from './components/editors/text-editor/text-editor.component';
import { CodeEditorComponent } from './components/editors/code-editor/code-editor.component';
import { WizardComponent } from './components/forms/wizard/wizard.component';
import { GoogleMapComponent } from './components/maps/google-map/google-map.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { ValidationComponent } from './components/forms/validation/validation.component';
import { TodoComponent } from './components/apps/todo-list/todo/todo.component';
import { BetsComponent } from './components/bets/bets.component';
import { TermsComponent } from './components/terms/terms.component';
import { ConfigComponent } from './components/config/config.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { UsersComponent } from './components/users/users.component';
import { ReportsComponent } from './components/reports/reports.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthInterceptorService } from './interceptors/request.interceptor';
import { BaseballComponent } from './components/baseball/baseball.component';
import { LoggerService } from './services/logger.service';
import { DateArPipe } from './pipes/dateAr.pipe';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BasketballComponent } from './components/basketball/basketball.component';
import { SoccerComponent } from './components/soccer/soccer.component';
import { ParlayService } from './services/parlay.service';
import { MyBetsComponent } from './components/my-bets/my-bets.component';

registerLocaleData(localeEsAr, 'es-Ar');

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
   url: 'https://httpbin.org/post',
   maxFilesize: 50,
   acceptedFiles: 'image/*'
 };
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SettingsPanelComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    Page404Component,
    WidgetsComponent,
    AccordionsComponent,
    ButtonsComponent,
    TodoListComponent,
    BadgesComponent,
    BreadcrumbsComponent,
    DropdownsComponent,
    ModalsComponent,
    ProgressbarComponent,
    PaginationComponent,
    TabsComponent,
    TypographyComponent,
    TooltipsComponent,
    ChartjsComponent,
    MorrisComponent,
    ChartistComponent,
    BasicTableComponent,
    DataTableComponent,
    PopupsComponent,
    NotificationsComponent,
    ThemifyComponent,
    FlagIconsComponent,
    MdiComponent,
    FontAwesomeComponent,
    SimpleLineIconsComponent,
    Page500Component,
    LoginComponent,
    Login2Component,
    RegisterComponent,
    Register2Component,
    LockscreenComponent,
    BlankPageComponent,
    ProfileComponent,
    FaqComponent,
    Faq2Component,
    NewsGridComponent,
    TimelineComponent,
    SearchResultsComponent,
    PortfolioComponent,
    InvoiceComponent,
    PricingComponent,
    OrdersComponent,
    EmailComponent,
    CalendarComponent,
    DragulaComponent,
    ClipboardComponent,
    MyContextMenuComponent,
    SliderComponent,
    CarouselComponent,
    LoadersComponent,
    BasicElementsComponent,
    AdvancedElementsComponent,
    TextEditorComponent,
    CodeEditorComponent,
    WizardComponent,
    GoogleMapComponent,
    DocumentationComponent,
    ValidationComponent,
    TodoComponent,
    BetsComponent,
    TermsComponent,
    ConfigComponent,
    PaymentsComponent,
    WalletComponent,
    UsersComponent,
    ReportsComponent,
    BaseballComponent,
    OddsPipe,
    DateArPipe,
    DateArSimplePipe,
    BasketballComponent,
    SoccerComponent,
    MyBetsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    DragulaModule.forRoot(),
    ClipboardModule,
    ContextMenuModule.forRoot(),
    NouisliderModule,
    CarouselModule,
    DropzoneModule,
    ColorPickerModule,
    AmazingTimePickerModule,
    TagInputModule,
    FormWizardModule,
    NgxSummernoteModule,
    TinymceModule.withConfig({
      skin_url: '../assets/tinymce/skins/lightgray'
    }),
    AceEditorModule,
    CodemirrorModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    NgSelectModule,
    MorrisJsModule,
    ChartistModule,
    DataTablesModule,
    SweetAlert2Module.forRoot(),
    ToastrModule.forRoot(),
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyCnT63XUjqjPgXZ0lFTU_pdpfUX7swzTTM' }),
    BarRatingModule,
    FullCalendarModule,
    ScrollToModule.forRoot(),
    NgxSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    Location, {provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: LOCALE_ID, useValue: 'es-Ar' },
    AuthService,
    UserService,
    OddService,
    LoggerService,
    IpService,
    VersionService,
    ParlayService,
    BetCalculatorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
