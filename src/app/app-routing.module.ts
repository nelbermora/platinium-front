import { AdminGuardian } from './guards/admin-guard';
import { MyBetsComponent } from './components/my-bets/my-bets.component';
import { SoccerComponent } from './components/soccer/soccer.component';
import { BasketballComponent } from './components/basketball/basketball.component';
import { BaseballComponent } from './components/baseball/baseball.component';
import { ReportsComponent } from './components/reports/reports.component';
import { UsersComponent } from './components/users/users.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { ConfigComponent } from './components/config/config.component';
import { TermsComponent } from './components/terms/terms.component';
import { BetsComponent } from './components/bets/bets.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Page404Component } from './components/error-pages/page404/page404.component';
import { WidgetsComponent } from './components/widgets/widgets.component';
import { AccordionsComponent } from './components/basic-ui-elements/accordions/accordions.component';
import { ButtonsComponent } from './components/basic-ui-elements/buttons/buttons.component';
import { TodoListComponent } from './components/apps/todo-list/todo-list.component';
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
import { AuthGuardian } from './guards/auth-guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', canActivate: [AuthGuardian], component: DashboardComponent },
  { path: 'bets', canActivate: [AuthGuardian], component: BetsComponent },
  { path: 'terms', canActivate: [AuthGuardian], component: TermsComponent },
  { path: 'profile', canActivate: [AuthGuardian], component: ProfileComponent },
  { path: 'config', canActivate: [AdminGuardian], component: ConfigComponent },
  { path: 'payments', canActivate: [AuthGuardian], component: PaymentsComponent },
  { path: 'wallet', canActivate: [AuthGuardian], component: WalletComponent },
  { path: 'users', canActivate: [AdminGuardian], component: UsersComponent },
  { path: 'reports', canActivate: [AdminGuardian], component: ReportsComponent },
  { path: 'terms', canActivate: [AuthGuardian], component: TermsComponent },
  { path: 'baseball', canActivate: [AuthGuardian], component: BaseballComponent },
  { path: 'basketball', canActivate: [AuthGuardian], component: BasketballComponent },
  { path: 'soccer', canActivate: [AuthGuardian], component: SoccerComponent },
  { path: 'mybets', canActivate: [AuthGuardian], component: MyBetsComponent },
  { path: 'widgets', component: WidgetsComponent },
  { path: 'accordions', component: AccordionsComponent },
  { path: 'buttons', component: ButtonsComponent },
  { path: 'badges', component: BadgesComponent },
  { path: 'breadcrumbs', component: BreadcrumbsComponent },
  { path: 'dropdowns', component: DropdownsComponent },
  { path: 'dropdowns', component: DropdownsComponent },
  { path: 'modals', component: ModalsComponent },
  { path: 'progressbar', component: ProgressbarComponent },
  { path: 'pagination', component: PaginationComponent },
  { path: 'tabs', component: TabsComponent },
  { path: 'typography', component: TypographyComponent },
  { path: 'tooltips', component: TooltipsComponent },
  { path: 'dragula', component: DragulaComponent },
  { path: 'clipboard', component: ClipboardComponent },
  { path: 'context-menu', component: MyContextMenuComponent },
  { path: 'slider', component: SliderComponent },
  { path: 'carousel', component: CarouselComponent },
  { path: 'loaders', component: LoadersComponent },
  { path: 'basic-elements', component: BasicElementsComponent },
  { path: 'advanced-elements', component: AdvancedElementsComponent },
  { path: 'validation', component: ValidationComponent },
  { path: 'wizard', component: WizardComponent },
  { path: 'text-editor', component: TextEditorComponent },
  { path: 'code-editor', component: CodeEditorComponent },
  { path: 'chartjs', component: ChartjsComponent },
  { path: 'chartist', component: ChartistComponent },
  { path: 'morris', component: MorrisComponent },
  { path: 'basic-table', component: BasicTableComponent },
  { path: 'data-table', component: DataTableComponent },
  { path: 'popups', component: PopupsComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'flag-icons', component: FlagIconsComponent },
  { path: 'mdi', component: MdiComponent },
  { path: 'font-awesome', component: FontAwesomeComponent },
  { path: 'simple-line-icons', component: SimpleLineIconsComponent },
  { path: 'themify', component: ThemifyComponent },
  { path: 'google-map', component: GoogleMapComponent },  
  { path: 'login', component: Login2Component },
  { path: 'register', component: RegisterComponent },
  { path: 'register-2', component: Register2Component },
  { path: 'lock-screen', component: LockscreenComponent },
  { path: 'error-500', component: Page500Component },
  { path: 'error-404', component: Page404Component },
  { path: 'blank-page', component: BlankPageComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'faq-2', component: Faq2Component },
  { path: 'news-grid', component: NewsGridComponent },
  { path: 'timeline', component: TimelineComponent },
  { path: 'search-results', component: SearchResultsComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'invoice', component: InvoiceComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'email', component: EmailComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'todo-list', component: TodoListComponent },
  { path: 'documentation', component: DocumentationComponent },
  { path: '**', redirectTo: '/error-404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
