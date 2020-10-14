import * as exclusion from "../../src/exclusion";
import * as inclusion from "../../src/inclusion";
import * as sinon from "sinon";

import { apply } from "../../src";
import { expect } from "chai";

describe("index", () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => sandbox = sinon.createSandbox());

    afterEach(() => sandbox.restore());

    it("should extract and use exclusion filters", () => {
        // Given
        const exclusionMock = sandbox.mock(exclusion);
        const inclusionMock = sandbox.mock(inclusion);

        const source = { key: "value" };
        const filters = ["filter"];

        sandbox.stub(exclusion, "extract").withArgs(filters).returns(filters);
        sandbox.stub(inclusion, "extract").withArgs(filters).returns([]);

        exclusionMock.expects("filter").calledWith(source, filters);
        inclusionMock.expects("filter").never();

        // When
        apply(source, filters);

        // Then
        exclusionMock.verify();
        inclusionMock.verify();
    });

    it("should extract and use inclusion filters", () => {
        // Given
        const exclusionMock = sandbox.mock(exclusion);
        const inclusionMock = sandbox.mock(inclusion);

        const source = { key: "value" };
        const filters = ["filter"];

        sandbox.stub(exclusion, "extract").withArgs(filters).returns([]);
        sandbox.stub(inclusion, "extract").withArgs(filters).returns(filters);

        exclusionMock.expects("filter").never();
        inclusionMock.expects("filter").calledWith(source, filters);

        // When
        apply(source, filters);

        // Then
        exclusionMock.verify();
        inclusionMock.verify();
    });

    it("should return a source where inclusion filters are applied only", () => {
        // Given
        const expectedResult = { key1: "value1" };

        const source = { key: "value" };
        const filters = ["filter"];

        sandbox.stub(exclusion, "extract").withArgs(filters).returns([]);
        sandbox.stub(inclusion, "extract").withArgs(filters).returns(filters);
        sandbox.stub(inclusion, "filter").withArgs(source, filters).returns(expectedResult);

        // When
        const result = apply(source, filters);

        // Then
        expect(result).to.equal(expectedResult);
    });

    it("should return a source where exclusion filters are applied", () => {
        // Given
        const expectedResult = { key1: "value1" };

        const source = { key: "value" };
        const filters = ["filter"];

        sandbox.stub(exclusion, "extract").withArgs(filters).returns(filters);
        sandbox.stub(inclusion, "extract").withArgs(filters).returns([]);
        sandbox.stub(exclusion, "filter").withArgs(source, filters).returns(expectedResult);

        // When
        const result = apply(source, filters);

        // Then
        expect(result).to.equal(expectedResult);
    });
});
