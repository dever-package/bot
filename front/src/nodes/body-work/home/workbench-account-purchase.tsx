import {
  BadgeCheck,
  CalendarDays,
  CircleCheck,
  Coins,
  CreditCard,
  LoaderCircle,
  PackageOpen,
} from "lucide-react";
import { Button } from "@dever/front-plugin";
import type {
  AccountIdentityCatalog,
  AccountOverview,
  AccountPlan,
  AccountPointPackage,
} from "./workbench-account-api";
import {
  formatAccountDuration,
  formatAccountMoney,
  formatAccountNumber,
} from "./workbench-account-format";
import { AccountEmpty } from "./workbench-account-state";
import { resolveConfiguredLucideIcon } from "../shared/configured-icon";

export function AccountPlansView({
  overview,
  activeIdentity,
  activeIdentityID,
  pointName,
  busyKey,
  onIdentityChange,
  onCheckout,
}: {
  overview: AccountOverview;
  activeIdentity: AccountIdentityCatalog | null;
  activeIdentityID: number;
  pointName: string;
  busyKey: string;
  onIdentityChange: (identityID: number) => void;
  onCheckout: (plan: AccountPlan) => void;
}) {
  return (
    <section className="hb-account-section">
      <div className="hb-account-section-heading">
        <div>
          <h2>订阅计划</h2>
          <p>
            {overview.catalog.length} 个使用{pointName}的订阅身份
          </p>
        </div>
        {overview.catalog.length > 1 ? (
          <div className="hb-account-identity-switch" aria-label="订阅身份">
            {overview.catalog.map((identity) => (
              <button
                key={identity.id}
                type="button"
                className={identity.id === activeIdentityID ? "is-active" : ""}
                onClick={() => onIdentityChange(identity.id)}
              >
                {identity.name}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {activeIdentity ? (
        <div className="hb-account-plan-grid">
          {activeIdentity.levels.map((plan) => (
            <AccountPlanCard
              key={plan.id}
              identity={activeIdentity}
              plan={plan}
              busy={busyKey === `plan-${plan.id}`}
              disabled={Boolean(busyKey)}
              onCheckout={() => onCheckout(plan)}
            />
          ))}
        </div>
      ) : (
        <AccountEmpty
          icon={<BadgeCheck />}
          text={`暂无使用${pointName}的订阅计划`}
        />
      )}
    </section>
  );
}

function AccountPlanCard({
  identity,
  plan,
  busy,
  disabled,
  onCheckout,
}: {
  identity: AccountIdentityCatalog;
  plan: AccountPlan;
  busy: boolean;
  disabled: boolean;
  onCheckout: () => void;
}) {
  const current = identity.currentLevelID === plan.id;
  const action = current
    ? "续订当前方案"
    : identity.currentLevelID
      ? "切换到此方案"
      : "立即订阅";
  return (
    <article className={`hb-account-plan${current ? " is-current" : ""}`}>
      <div className="hb-account-plan-head">
        <div>
          <span>{identity.name}</span>
          <h3>{plan.name}</h3>
        </div>
        {current ? <em>当前方案</em> : null}
      </div>
      <div className="hb-account-plan-price">
        <strong>{formatAccountNumber(plan.checkoutPoints)}</strong>
        <span>{identity.pointConfig.name}</span>
      </div>
      <p className="hb-account-plan-cash">
        参考价 {formatAccountMoney(plan.payAmountMicros)} · {formatAccountDuration(plan.durationDays)}
      </p>
      <div className="hb-account-plan-benefits">
        {plan.benefitDescriptions.length > 0
          ? plan.benefitDescriptions.map((benefit, index) => {
              const Icon = resolveConfiguredLucideIcon(
                benefit.icon,
                CircleCheck,
              );
              return (
                <span key={`${benefit.text}-${index}`}>
                  <Icon />
                  {benefit.text}
                </span>
              );
            })
          : (
            <>
              {plan.periodicBenefits.map((benefit, index) => (
                <span key={`${benefit.pointName}-${index}`}>
                  <Coins />
                  每 {benefit.cycleDays} 天 {formatAccountNumber(benefit.pointAmount)} {benefit.pointName}
                </span>
              ))}
              {plan.billingBenefits.map((benefit, index) => (
                <span key={`${benefit.scope}-${index}`}>
                  <CreditCard />
                  能力计费系数 {benefit.saleRatio || "1"}
                </span>
              ))}
              {plan.periodicBenefits.length === 0 && plan.billingBenefits.length === 0 ? (
                <span>
                  <CalendarDays />
                  有效期内享受当前等级权益
                </span>
              ) : null}
            </>
          )}
      </div>
      <Button className="w-full" disabled={disabled} onClick={onCheckout}>
        {busy ? <LoaderCircle className="animate-spin" /> : null}
        {busy ? "处理中" : action}
      </Button>
    </article>
  );
}

export function AccountPointPackagesView({
  overview,
  pointName,
  busyKey,
  onCheckout,
}: {
  overview: AccountOverview;
  pointName: string;
  busyKey: string;
  onCheckout: (item: AccountPointPackage) => void;
}) {
  return (
    <section className="hb-account-section">
      <div className="hb-account-section-heading">
        <div>
          <h2>购买{pointName}</h2>
          <p>{overview.pointPackages.length} 个可用套餐</p>
        </div>
      </div>
      {overview.pointPackages.length > 0 ? (
        <div className="hb-account-package-grid">
          {overview.pointPackages.map((item) => (
            <article key={item.id} className="hb-account-package">
              <PackageOpen />
              <h3>{item.name}</h3>
              <strong>
                {formatAccountNumber(item.pointAmount + item.bonusAmount)} {item.pointConfig.name}
              </strong>
              <p>
                基础 {formatAccountNumber(item.pointAmount)}
                {item.bonusAmount > 0
                  ? `，赠送 ${formatAccountNumber(item.bonusAmount)}`
                  : ""}
              </p>
              <Button
                variant="outline"
                disabled={Boolean(busyKey)}
                onClick={() => onCheckout(item)}
              >
                {busyKey === `package-${item.id}` ? (
                  <LoaderCircle className="animate-spin" />
                ) : null}
                {formatAccountMoney(item.payAmountMicros)}
              </Button>
            </article>
          ))}
        </div>
      ) : (
        <AccountEmpty
          icon={<PackageOpen />}
          text={`暂无可购买的${pointName}套餐`}
        />
      )}
    </section>
  );
}
