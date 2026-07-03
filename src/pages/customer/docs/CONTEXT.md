# Mittae Esan Management

Frontend for managing customers, contracts, assets, and branches for a lending/installment business.

## Language

**Customer**:
A person or organization that can hold contracts and assets. Split into two `personalType` variants — Individual and Corporate — which render different fields and validation.
_Avoid_: Client, account holder

**Individual** (`personalType: INDIVIDUAL`):
A customer who is a natural person. Identified by a 13-digit citizen ID (`idCard`), has a title/first/last name, birth date, and occupation. Has three distinct addresses: main (per ID card), current (mailing), and work.
_Avoid_: Personal customer, natural person

**Corporate** (`personalType: CORPORATE`):
A customer who is a registered legal entity (company). Identified by a 13-digit tax ID, reusing the `idCard` field; the entity's registered name reuses the `firstName` field (title, last name, birth date, and occupation do not apply). Has a single address only — `mainAddress` — with `currentAddress`/`workAddress` omitted entirely rather than mirrored.
_Avoid_: Juristic person, company, business customer

**Main Address**:
The address tied to a Customer's identity document — the citizen ID card for Individuals, or the registered address for Corporates.
_Avoid_: Citizen address, home address

**Current Address**:
An Individual customer's mailing address, may be copied from Main Address. Not applicable to Corporate customers.

**Work Address**:
An Individual customer's workplace address, may be copied from Current or Main Address. Not applicable to Corporate customers.
