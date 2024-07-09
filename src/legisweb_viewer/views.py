from typing import NamedTuple

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet

from legisweb_viewer.documents import (
    AnswerContentDocument,
    InquiryContentDocument,
    QuestionContentDocument,
    RespondContentDocument,
    SpeechContentDocument,
)
from legisweb_viewer.models import Hansard, Inquiry, Person
from legisweb_viewer.serializers import (
    AnswerContentSearchSerializer,
    HansardSerializer,
    InquiryContentSearchSerializer,
    InquirySerializer,
    PersonSerializer,
    QuestionContentSearchSerializer,
    RespondContentSearchSerializer,
    SpeechContentSearchSerializer,
)


class SearchData(NamedTuple):
    document_type: str | None = None
    query: str | None = None


class PersonViewSet(ReadOnlyModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer


class InquiryViewSet(ReadOnlyModelViewSet):
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer


class HansardViewSet(ReadOnlyModelViewSet):
    queryset = Hansard.objects.all()
    serializer_class = HansardSerializer

@api_view(["POST"])
def search(request: Request, format=None) -> Response:
    result = None
    data = SearchData(**request.data)  # type: ignore

    match data.document_type:
        case "inquiry":
            hits = (
                InquiryContentDocument.search()
                .query(
                    "multi_match",
                    query=data.query,
                    fields=["value", "inquirer.raw"],
                )
                .highlight("value")
            )
            serializer = InquiryContentSearchSerializer(hits, many=True)
            result = Response(serializer.data)

        case "respond":
            hits = (
                RespondContentDocument.search()
                .query(
                    "multi_match",
                    query=data.query,
                    fields=["value", "respondent.raw"],
                )
                .highlight("value")
            )
            serializer = RespondContentSearchSerializer(hits, many=True)
            result = Response(serializer.data)

        case "question":
            hits = (
                QuestionContentDocument.search()
                .query(
                    "multi_match",
                    query=data.query,
                    fields=["value", "question.raw"],
                )
                .highlight("value")
            )
            serializer = QuestionContentSearchSerializer(hits, many=True)
            result = Response(serializer.data)

        case "answer":
            hits = (
                AnswerContentDocument.search()
                .query(
                    "multi_match",
                    query=data.query,
                    fields=["value", "answer.raw"],
                )
                .highlight("value")
            )
            for hit in hits:
                print(hit.to_dict(), hit.meta.highlight)
            serializer = AnswerContentSearchSerializer(hits, many=True)
            result = Response(serializer.data)

        case "speech":
            hits = (
                SpeechContentDocument.search()
                .query(
                    "multi_match",
                    query=data.query,
                    fields=["value", "by.raw"],
                )
                .highlight("value")
            )
            serializer = SpeechContentSearchSerializer(hits, many=True)
            result = Response(serializer.data)

        case None | _:
            result = Response("Bad search request", status=status.HTTP_400_BAD_REQUEST)

    return result